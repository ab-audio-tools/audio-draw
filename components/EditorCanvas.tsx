/**
 * EditorCanvas - Main React Flow Canvas Component
 * Orchestrates the node-based audio patchbay editor
 */

import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  OnConnectStart,
  OnConnectEnd,
  ConnectionMode,
  useReactFlow,
  OnEdgeUpdateFunc,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useEditorStore } from '@/hooks/useEditorStore';
import { useDevices } from '@/hooks/useDevices';
import { validateConnection, findPortById } from '@/lib/validation';
import { toast } from '@/hooks/use-toast';
import DeviceNode from './DeviceNode';
import ConnectionEdge from './ConnectionEdge';
import CableEditor from './CableEditor';

const nodeTypes = {
  device: DeviceNode,
};

const edgeTypes = {
  default: ConnectionEdge,
};

interface EditorCanvasProps {
  onSave?: () => void;
}

function EditorCanvasInner({ onSave }: EditorCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeRef = useRef<{ nodeId: string; handleId: string } | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    snapToGrid,
    gridSize,
    showGrid,
    addNode,
    addEdge: addStoreEdge,
    deleteEdge,
    saveToHistory,
  } = useEditorStore();

  const { getDeviceById, devices } = useDevices();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync with store
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  useEffect(() => {
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);

  useEffect(() => {
    setStoreEdges(edges);
  }, [edges, setStoreEdges]);

  // Handle connection validation
  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      if (!connection.source || !connection.target) return false;
      if (!connection.sourceHandle || !connection.targetHandle) return false;

      // Find source and target nodes
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      // Find ports
      const sourcePort = findPortById(sourceNode.data.ports, connection.sourceHandle);
      const targetPort = findPortById(targetNode.data.ports, connection.targetHandle);

      if (!sourcePort || !targetPort) return false;

      // Validate connection
      const validation = validateConnection(sourcePort, targetPort);

      if (!validation.valid) {
        toast({
          title: 'Invalid Connection',
          description: validation.message,
        });
        return false;
      }

      if (validation.warning) {
        toast({
          title: 'Warning',
          description: validation.message,
        });
      }

      return true;
    },
    [nodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isValidConnection(connection)) {
        return;
      }

      if (!connection.source || !connection.target) return;

      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: 'default',
        data: {
          signalType: nodes.find((n) => n.id === connection.source)?.data.ports.find(
            (p: any) => p.id === connection.sourceHandle
          )?.signalType,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [isValidConnection, nodes, setEdges, saveToHistory]
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId, handleId }) => {
    if (nodeId && handleId) {
      connectingNodeRef.current = { nodeId, handleId };
    }
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(() => {
    connectingNodeRef.current = null;
  }, []);

  // Handle node deletion
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach((node) => {
        // Delete associated edges
        const associatedEdges = edges.filter(
          (e) => e.source === node.id || e.target === node.id
        );
        associatedEdges.forEach((e) => deleteEdge(e.id));
      });
      saveToHistory();
    },
    [edges, deleteEdge, saveToHistory]
  );

  const onEdgesDelete = useCallback(() => {
    saveToHistory();
    setSelectedEdge(null);
  }, [saveToHistory]);

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  }, []);

  // Handle edge data update
  const onEdgeDataUpdate = useCallback((edgeId: string, data: Partial<Edge['data']>) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, ...data } }
          : e
      )
    );
    saveToHistory();
  }, [setEdges, saveToHistory]);

  // Close editor when clicking on canvas
  const onPaneClick = useCallback(() => {
    setSelectedEdge(null);
  }, []);

  // Handle edge update (reconnection)
  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => {
      if (!isValidConnection(newConnection)) {
        return;
      }

      setEdges((els) => {
        const updatedEdges = els.filter((e) => e.id !== oldEdge.id);
        
        if (!newConnection.source || !newConnection.target) return els;

        const newEdge: Edge = {
          id: `edge-${newConnection.source}-${newConnection.sourceHandle}-${newConnection.target}-${newConnection.targetHandle}`,
          source: newConnection.source,
          target: newConnection.target,
          sourceHandle: newConnection.sourceHandle,
          targetHandle: newConnection.targetHandle,
          type: 'default',
          data: {
            signalType: nodes.find((n) => n.id === newConnection.source)?.data.ports.find(
              (p: any) => p.id === newConnection.sourceHandle
            )?.signalType,
          },
        };

        return [...updatedEdges, newEdge];
      });

      saveToHistory();
      
      toast({
        title: 'Connection Updated',
        description: 'Cable reconnected successfully',
      });
    },
    [isValidConnection, nodes, setEdges, saveToHistory]
  );

  // Handle drag over to allow drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop to add new device node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const deviceId = event.dataTransfer.getData('deviceId');
      if (!deviceId) return;

      const device = devices.find((d) => d.id === deviceId);
      if (!device) return;

      // Get the position where the device was dropped
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'device',
        position,
        data: {
          deviceId: device.id,
          deviceName: device.name,
          deviceSlug: device.slug,
          imageUrl: device.imageUrl,
          ports: device.schema.ports,
          meta: device.schema.meta,
        },
      };

      addNode(newNode);
      saveToHistory();
      
      toast({
        title: 'Device Added',
        description: `${device.name} added to canvas`,
      });
    },
    [devices, screenToFlowPosition, addNode, saveToHistory]
  );

  return (
    <div 
      ref={reactFlowWrapper} 
      className="h-full w-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onContextMenu={(e) => {
        // Allow custom context menus on nodes, prevent on pane
        const target = e.target as HTMLElement;
        if (!target.closest('.react-flow__node')) {
          e.preventDefault();
        }
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        fitView
        attributionPosition="bottom-left"
        // Enable edge editing and reconnection
        edgesFocusable={true}
        edgesUpdatable={true}
        // Disable default context menu to allow custom ones
        nodesDraggable={true}
        nodesConnectable={true}
        nodesFocusable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
          updatable: true,
          focusable: true,
        }}
      >
        <Background
          variant={showGrid ? BackgroundVariant.Dots : BackgroundVariant.Lines}
          gap={gridSize}
          size={1}
        />
        <Controls />
      </ReactFlow>
      
      {/* Cable Editor Panel */}
      {selectedEdge && (
        <CableEditor
          edge={selectedEdge}
          onUpdate={onEdgeDataUpdate}
          onClose={() => setSelectedEdge(null)}
        />
      )}
    </div>
  );
}

export default function EditorCanvas(props: EditorCanvasProps) {
  return (
    <ReactFlowProvider>
      <EditorCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

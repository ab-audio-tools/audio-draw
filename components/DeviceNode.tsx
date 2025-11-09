/**
 * DeviceNode - Custom React Flow Node Component
 * Displays audio devices with interactive ports
 */

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import ReactDOM from 'react-dom';
// Use native <img> to avoid fetchPriority warnings in some React versions
import type { DevicePort } from '@/lib/deviceSchema';
import { getSignalTypeColor, getSignalTypeLabel, getDefaultConnectorType, getConnectorLabel } from '@/lib/deviceSchema';
import { cn } from '@/lib/utils';
import ConnectorIcon from './ConnectorIcon';
import { useEditorStore } from '@/hooks/useEditorStore';
import NodeContextMenu from './NodeContextMenu';
import EditNodeModal from './EditNodeModal';
import ConfirmDialog from './ConfirmDialog';

interface DeviceNodeData {
  deviceId: string;
  deviceName: string;
  deviceSlug: string;
  imageUrl: string | null;
  ports: DevicePort[];
  meta?: {
    manufacturer?: string;
    model?: string;
    category?: string;
    description?: string;
  };
  // optional movable label offset (relative to node top-left)
  labelOffset?: { x: number; y: number };
  // whether to show the side label (optional, defaults to true)
  showSideLabel?: boolean;
  // whether the node position is locked
  isLocked?: boolean;
}

function DeviceNode({ id, data, selected }: NodeProps<DeviceNodeData>) {
  const inputPorts = data.ports.filter((p) => p.direction === 'input');
  const outputPorts = data.ports.filter((p) => p.direction === 'output');
  const snapToGrid = useEditorStore((s) => s.snapToGrid);
  const updateNode = useEditorStore((s) => s.updateNode);
  const saveToHistory = useEditorStore((s) => s.saveToHistory);
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const addNode = useEditorStore((s) => s.addNode);
  const nodes = useEditorStore((s) => s.nodes);

  // label position state (local while dragging), persisted to node.data.labelOffset
  const initialOffset = data.labelOffset ?? { x: 128, y: 0 };
  const [labelOffset, setLabelOffset] = useState<{ x: number; y: number }>(initialOffset);
  const draggingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const pointerDownClientRef = useRef<{ x: number; y: number } | null>(null);
  const labelStartOffsetRef = useRef<{ x: number; y: number }>(initialOffset);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.deviceName || '');

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copiedNodeData, setCopiedNodeData] = useState<any>(null);

  useEffect(() => {
    // keep local state in sync if external data changes
    if (data.labelOffset && (data.labelOffset.x !== labelOffset.x || data.labelOffset.y !== labelOffset.y)) {
      setLabelOffset(data.labelOffset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.labelOffset]);

  const onPointerDownLabel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // stop propagation so React Flow doesn't start dragging the node
    e.stopPropagation();
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    try {
      target.setPointerCapture(e.pointerId);
    } catch (err) {
      // ignore if pointer capture not available
    }
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    pointerDownClientRef.current = { x: e.clientX, y: e.clientY };
    labelStartOffsetRef.current = labelOffset;
  }, []);

  const onPointerMoveLabel = useCallback((e: PointerEvent) => {
    if (!draggingRef.current || !pointerDownClientRef.current) return;
    const base = labelStartOffsetRef.current;
    const dx = e.clientX - pointerDownClientRef.current.x;
    const dy = e.clientY - pointerDownClientRef.current.y;
    const proposed = { x: base.x + dx, y: base.y + dy };
    // clamp within +/-200px from node origin (0,0 = node top-left corner)
    const maxDelta = 200;
    const clamped = {
      x: Math.max(-maxDelta, Math.min(maxDelta, proposed.x)),
      y: Math.max(-maxDelta, Math.min(maxDelta, proposed.y)),
    };
    setLabelOffset(clamped);
  }, []);

  const endDrag = useCallback((e?: PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    startRef.current = null;
    pointerDownClientRef.current = null;
    // persist to node data
    if (id) {
      // defer update to avoid synchronous nested store updates causing React update loops
      setTimeout(() => {
        updateNode(id, { data: { ...data, labelOffset } });
        saveToHistory();
      }, 0);
    }
  }, [data, id, labelOffset, updateNode, saveToHistory]);

  useEffect(() => {
    // global listeners while dragging
    window.addEventListener('pointermove', onPointerMoveLabel);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('pointermove', onPointerMoveLabel);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [onPointerMoveLabel, endDrag]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Get the actual screen position (accounting for scroll)
    const x = e.clientX;
    const y = e.clientY;
    // Small delay to prevent the same click from closing the menu
    setTimeout(() => {
      setContextMenu({ x, y });
    }, 10);
  }, []);

  const handleEditNode = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleRename = useCallback(() => {
    setIsEditing(true);
    setEditValue(data.deviceName || '');
  }, [data.deviceName]);

  const handleDelete = useCallback(() => {
    setConfirmDelete(true);
  }, []);

  const confirmDeleteNode = useCallback(() => {
    if (id) {
      deleteNode(id);
      saveToHistory();
    }
    setConfirmDelete(false);
  }, [id, deleteNode, saveToHistory]);

  const handleDuplicate = useCallback(() => {
    if (!id) return;
    const currentNode = nodes.find((n) => n.id === id);
    if (!currentNode) return;

    // Create new ports with unique IDs
    const newPorts = currentNode.data.ports.map((port: DevicePort) => ({
      ...port,
      id: `port-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));

    const newNode = {
      ...currentNode,
      id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      position: {
        x: currentNode.position.x + 50,
        y: currentNode.position.y + 50,
      },
      data: {
        ...currentNode.data,
        deviceName: `${currentNode.data.deviceName} (Copy)`,
        ports: newPorts,
      },
    };
    addNode(newNode);
    saveToHistory();
  }, [id, nodes, addNode, saveToHistory]);

  const handleCopy = useCallback(() => {
    if (!id) return;
    const currentNode = nodes.find((n) => n.id === id);
    if (currentNode) {
      setCopiedNodeData(JSON.parse(JSON.stringify(currentNode.data)));
    }
  }, [id, nodes]);

  const handlePaste = useCallback(() => {
    if (!copiedNodeData || !id) return;
    const currentNode = nodes.find((n) => n.id === id);
    if (!currentNode) return;

    const newNode = {
      ...currentNode,
      id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      position: {
        x: currentNode.position.x + 50,
        y: currentNode.position.y + 50,
      },
      data: {
        ...copiedNodeData,
        deviceName: `${copiedNodeData.deviceName} (Pasted)`,
      },
    };
    addNode(newNode);
    saveToHistory();
  }, [copiedNodeData, id, nodes, addNode, saveToHistory]);

  const handleToggleLock = useCallback(() => {
    if (id) {
      const newLockState = !data.isLocked;
      setTimeout(() => {
        updateNode(id, { 
          data: { ...data, isLocked: newLockState },
          draggable: !newLockState, // when locked, not draggable
        });
        saveToHistory();
      }, 0);
    }
  }, [id, data, updateNode, saveToHistory]);

  const handleSavePorts = useCallback((ports: DevicePort[]) => {
    if (id) {
      setTimeout(() => {
        updateNode(id, { data: { ...data, ports } });
        saveToHistory();
      }, 0);
    }
  }, [id, data, updateNode, saveToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 for rename
      if (e.key === 'F2') {
        e.preventDefault();
        handleRename();
      }
      // Delete key
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      }
      // Ctrl/Cmd + D for duplicate
      else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicate();
      }
      // Ctrl/Cmd + C for copy
      else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }
      // Ctrl/Cmd + V for paste
      else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, handleRename, handleDelete, handleDuplicate, handleCopy, handlePaste]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative"
      style={{ width: 120, height: 120 }}
      onContextMenu={handleContextMenu}
    >
      {/* Device Image Only */}
      <div className={cn(
        'relative h-full w-full overflow-hidden rounded-lg shadow-lg transition-all',
        selected ? 'ring-4 ring-blue-500 ring-offset-2' : ''
      )}>
        {data.imageUrl && (
          <img
            src={data.imageUrl}
            alt={data.deviceName}
            className="object-cover w-full h-full"
            onError={(e: any) => {
              e.currentTarget.src = '/placeholder-device.svg';
            }}
          />
        )}
      </div>

      {/* Side movable label shown when grid snapping is enabled (plain text, no background) */}
      {(snapToGrid || data.showSideLabel !== false) && (
        <div
          className="absolute z-40 cursor-grab flex items-start"
          style={{ left: labelOffset.x, top: labelOffset.y, touchAction: 'none' }}
          onPointerDown={onPointerDownLabel}
          title={data.deviceName}
          draggable={false}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
            setEditValue(data.deviceName || '');
          }}
        >
          <div style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
            {!isEditing ? (
              <div className="text-xs font-medium text-gray-900">
                {data.deviceName}
              </div>
            ) : (
              <input
                autoFocus
                value={editValue}
                onChange={(ev) => setEditValue(ev.target.value)}
                onBlur={() => {
                  setIsEditing(false);
                  setTimeout(() => {
                    if (id) updateNode(id, { data: { ...data, deviceName: editValue } });
                    saveToHistory();
                  }, 0);
                }}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    (ev.target as HTMLInputElement).blur();
                  } else if (ev.key === 'Escape') {
                    setIsEditing(false);
                  }
                }}
                className="border-b border-gray-300 bg-transparent text-xs font-medium text-gray-900 outline-none"
                style={{ width: 160 }}
              />
            )}
          </div>
        </div>
      )}

      {/* Input Ports - Top Edge */}
      {inputPorts.length > 0 && (
        <div 
          className="absolute left-0 right-0 flex justify-center gap-3"
          style={{ top: -7 }}
        >
          {inputPorts.map((port, index) => (
            <PortHandle
              key={port.id}
              port={port}
              position={Position.Top}
              index={index}
              total={inputPorts.length}
            />
          ))}
        </div>
      )}

      {/* Output Ports - Bottom Edge */}
      {outputPorts.length > 0 && (
        <div 
          className="absolute left-0 right-0 flex justify-center gap-3"
          style={{ bottom: -7 }}
        >
          {outputPorts.map((port, index) => (
            <PortHandle
              key={port.id}
              port={port}
              position={Position.Bottom}
              index={index}
              total={outputPorts.length}
            />
          ))}
        </div>
      )}
      
      {/* Context Menu - rendered via portal to avoid transform issues */}
      {contextMenu && typeof window !== 'undefined' && ReactDOM.createPortal(
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isLocked={data.isLocked}
          onEditNode={handleEditNode}
          onRename={handleRename}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onToggleLock={handleToggleLock}
          onClose={() => setContextMenu(null)}
        />,
        document.body
      )}

      {/* Edit Node Modal */}
      {showEditModal && (
        <EditNodeModal
          nodeName={data.deviceName}
          ports={data.ports}
          onSave={handleSavePorts}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Node"
          message={`Are you sure you want to delete "${data.deviceName}"? This will also remove all connected cables.`}
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
          onConfirm={confirmDeleteNode}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </motion.div>
  );
}

interface PortHandleProps {
  port: DevicePort;
  position: Position;
  index: number;
  total: number;
}

function PortHandle({ port, position, index, total }: PortHandleProps) {
  const color = getSignalTypeColor(port.signalType);
  const connectorType = port.connectorType || getDefaultConnectorType(port.signalType);
  const connectorLabel = getConnectorLabel(connectorType);

  return (
    <div className="group relative">
      {/* Connector background circle */}
      <div 
        className="relative flex items-center justify-center rounded-full"
        style={{ 
          width: 24, 
          height: 24,
          backgroundColor: 'white',
          border: `2px solid ${color}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {/* Connector icon */}
        <ConnectorIcon 
          type={connectorType} 
          size={14} 
          color={color}
        />
        
        {/* React Flow Handle (invisible but functional) */}
        <Handle
          type={port.direction === 'input' ? 'target' : 'source'}
          position={position}
          id={port.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            cursor: 'crosshair',
            opacity: 0,
          }}
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
        <div className="font-medium">{port.name}</div>
        <div className="text-gray-300">{getSignalTypeLabel(port.signalType)}</div>
        <div className="text-gray-400 text-[10px]">{connectorLabel}</div>
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

export default memo(DeviceNode);

/**
 * Editor Store using Zustand
 * Manages global editor state with undo/redo support and localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { Node, Edge, Viewport } from 'reactflow';
import type { DeviceNode, DeviceEdge } from '@/lib/deviceSchema';

/**
 * History entry for undo/redo
 */
interface HistoryEntry {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

/**
 * Editor state
 */
interface EditorState {
  // Current state
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  selectedNodes: string[];
  selectedEdges: string[];
  
  // Settings
  snapToGrid: boolean;
  gridSize: number;
  showGrid: boolean;
  
  // History for undo/redo
  history: HistoryEntry[];
  historyIndex: number;
  maxHistorySize: number;
  
  // Project metadata
  projectId: string | null;
  projectName: string;
  isDirty: boolean;
  
  // Actions - Node Management
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  
  // Actions - Edge Management
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;
  
  // Actions - Viewport
  setViewport: (viewport: Viewport) => void;
  
  // Actions - Selection
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;
  
  // Actions - Settings
  setSnapToGrid: (snap: boolean) => void;
  setGridSize: (size: number) => void;
  setShowGrid: (show: boolean) => void;
  
  // Actions - History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  clearHistory: () => void;
  
  // Actions - Project
  setProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setIsDirty: (dirty: boolean) => void;
  loadProject: (nodes: Node[], edges: Edge[], viewport?: Viewport) => void;
  resetEditor: () => void;
}

const INITIAL_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 };

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      viewport: INITIAL_VIEWPORT,
      selectedNodes: [],
      selectedEdges: [],
      
      // Initial settings
      snapToGrid: true,
      gridSize: 15,
      showGrid: true,
      
      // Initial history
      history: [],
      historyIndex: -1,
      maxHistorySize: 50,
      
      // Initial project
      projectId: null,
      projectName: 'Untitled Project',
      isDirty: false,
      
      // Node Management
      setNodes: (nodes) => {
        set({ nodes, isDirty: true });
      },
      
      addNode: (node) => {
        set(
          produce((state: EditorState) => {
            state.nodes.push(node);
            state.isDirty = true;
          })
        );
        get().saveToHistory();
      },
      
      updateNode: (nodeId, data) => {
        set(
          produce((state: EditorState) => {
            const index = state.nodes.findIndex((n) => n.id === nodeId);
            if (index !== -1) {
              state.nodes[index] = { ...state.nodes[index], ...data };
              state.isDirty = true;
            }
          })
        );
      },
      
      deleteNode: (nodeId) => {
        set(
          produce((state: EditorState) => {
            state.nodes = state.nodes.filter((n) => n.id !== nodeId);
            state.edges = state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
            state.isDirty = true;
          })
        );
        get().saveToHistory();
      },
      
      deleteNodes: (nodeIds) => {
        const nodeIdSet = new Set(nodeIds);
        set(
          produce((state: EditorState) => {
            state.nodes = state.nodes.filter((n) => !nodeIdSet.has(n.id));
            state.edges = state.edges.filter(
              (e) => !nodeIdSet.has(e.source) && !nodeIdSet.has(e.target)
            );
            state.isDirty = true;
          })
        );
        get().saveToHistory();
      },
      
      // Edge Management
      setEdges: (edges) => {
        set({ edges, isDirty: true });
      },
      
      addEdge: (edge) => {
        set(
          produce((state: EditorState) => {
            state.edges.push(edge);
            state.isDirty = true;
          })
        );
        get().saveToHistory();
      },
      
      deleteEdge: (edgeId) => {
        set(
          produce((state: EditorState) => {
            state.edges = state.edges.filter((e) => e.id !== edgeId);
            state.isDirty = true;
          })
        );
        get().saveToHistory();
      },
      
      deleteEdges: (edgeIds) => {
        const edgeIdSet = new Set(edgeIds);
        set(
          produce((state: EditorState) => {
            state.edges = state.edges.filter((e) => !edgeIdSet.has(e.id));
            state.isDirty = true;
          })
        );
        get().saveToHistory();
      },
      
      // Viewport
      setViewport: (viewport) => {
        set({ viewport });
      },
      
      // Selection
      setSelectedNodes: (nodeIds) => {
        set({ selectedNodes: nodeIds });
      },
      
      setSelectedEdges: (edgeIds) => {
        set({ selectedEdges: edgeIds });
      },
      
      clearSelection: () => {
        set({ selectedNodes: [], selectedEdges: [] });
      },
      
      // Settings
      setSnapToGrid: (snap) => {
        set({ snapToGrid: snap });
      },
      
      setGridSize: (size) => {
        set({ gridSize: size });
      },
      
      setShowGrid: (show) => {
        set({ showGrid: show });
      },
      
      // History - Undo/Redo
      undo: () => {
        const state = get();
        if (!state.canUndo()) return;
        
        const newIndex = state.historyIndex - 1;
        const entry = state.history[newIndex];
        
        set({
          nodes: entry.nodes,
          edges: entry.edges,
          historyIndex: newIndex,
          isDirty: true,
        });
      },
      
      redo: () => {
        const state = get();
        if (!state.canRedo()) return;
        
        const newIndex = state.historyIndex + 1;
        const entry = state.history[newIndex];
        
        set({
          nodes: entry.nodes,
          edges: entry.edges,
          historyIndex: newIndex,
          isDirty: true,
        });
      },
      
      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },
      
      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },
      
      saveToHistory: () => {
        set(
          produce((state: EditorState) => {
            const entry: HistoryEntry = {
              nodes: JSON.parse(JSON.stringify(state.nodes)),
              edges: JSON.parse(JSON.stringify(state.edges)),
              timestamp: Date.now(),
            };
            
            // Remove any history after current index (for redo)
            state.history = state.history.slice(0, state.historyIndex + 1);
            
            // Add new entry
            state.history.push(entry);
            
            // Limit history size
            if (state.history.length > state.maxHistorySize) {
              state.history.shift();
            } else {
              state.historyIndex++;
            }
          })
        );
      },
      
      clearHistory: () => {
        set({ history: [], historyIndex: -1 });
      },
      
      // Project Management
      setProjectId: (id) => {
        set({ projectId: id });
      },
      
      setProjectName: (name) => {
        set({ projectName: name, isDirty: true });
      },
      
      setIsDirty: (dirty) => {
        set({ isDirty: dirty });
      },
      
      loadProject: (nodes, edges, viewport) => {
        set({
          nodes,
          edges,
          viewport: viewport || INITIAL_VIEWPORT,
          isDirty: false,
        });
        get().clearHistory();
        get().saveToHistory();
      },
      
      resetEditor: () => {
        set({
          nodes: [],
          edges: [],
          viewport: INITIAL_VIEWPORT,
          selectedNodes: [],
          selectedEdges: [],
          projectId: null,
          projectName: 'Untitled Project',
          isDirty: false,
        });
        get().clearHistory();
        get().saveToHistory();
      },
    }),
    {
      name: 'audio-draw-editor',
      partialize: (state) => ({
        // Persist only essential data
        snapToGrid: state.snapToGrid,
        gridSize: state.gridSize,
        showGrid: state.showGrid,
        projectName: state.projectName,
      }),
    }
  )
);

/**
 * Connection Validation Logic
 * Validates connections between device ports based on signal types and direction
 */

import type { DevicePort, SignalType, PortDirection } from './deviceSchema';
import { SIGNAL_COMPATIBILITY } from './deviceSchema';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  warning?: boolean; // If true, connection is allowed but with a warning
}

/**
 * Validate a connection between two ports
 * @param sourcePort - The source (output) port
 * @param targetPort - The target (input) port
 * @returns ValidationResult indicating if the connection is valid
 */
export function validateConnection(
  sourcePort: DevicePort,
  targetPort: DevicePort
): ValidationResult {
  // Rule 1: Check direction - source must be output, target must be input
  if (sourcePort.direction !== 'output') {
    return {
      valid: false,
      message: 'Source port must be an output',
    };
  }

  if (targetPort.direction !== 'input') {
    return {
      valid: false,
      message: 'Target port must be an input',
    };
  }

  // Rule 2: Check signal type compatibility
  const sourceType = sourcePort.signalType;
  const targetType = targetPort.signalType;

  if (!areSignalTypesCompatible(sourceType, targetType)) {
    return {
      valid: false,
      message: `Incompatible signal types: ${sourceType} cannot connect to ${targetType}`,
    };
  }

  // Rule 3: Warnings for special cases
  if (sourceType === 'audio-mono' && targetType === 'audio-stereo') {
    return {
      valid: true,
      warning: true,
      message: 'Mono signal connected to stereo input (will use one channel)',
    };
  }

  // All checks passed
  return {
    valid: true,
    message: 'Connection is valid',
  };
}

/**
 * Check if two signal types are compatible
 * @param sourceType - The source signal type
 * @param targetType - The target signal type
 * @returns true if compatible, false otherwise
 */
export function areSignalTypesCompatible(
  sourceType: SignalType,
  targetType: SignalType
): boolean {
  const compatibleTypes = SIGNAL_COMPATIBILITY[sourceType];
  if (!compatibleTypes) {
    return false;
  }
  return compatibleTypes.includes(targetType);
}

/**
 * Validate connection by handle IDs
 * Used in React Flow connection validation
 */
export interface ConnectionParams {
  sourceHandle: string | null;
  targetHandle: string | null;
  source: string;
  target: string;
}

/**
 * Find port by ID in a list of ports
 */
export function findPortById(ports: DevicePort[], portId: string): DevicePort | null {
  return ports.find((p) => p.id === portId) || null;
}

/**
 * Validate if a node can have more connections
 * This is a placeholder for future enhancements (e.g., limiting connections per port)
 */
export function canNodeAcceptMoreConnections(
  nodeId: string,
  portId: string,
  existingConnections: number
): boolean {
  // For now, allow unlimited connections
  // In the future, could add rules like:
  // - Physical inputs can only have one connection
  // - Outputs can have multiple connections (splitter)
  return true;
}

/**
 * Check if connection would create a cycle
 * Prevents feedback loops in the audio graph
 */
export function wouldCreateCycle(
  sourceNodeId: string,
  targetNodeId: string,
  existingEdges: Array<{ source: string; target: string }>
): boolean {
  // Can't connect to self
  if (sourceNodeId === targetNodeId) {
    return true;
  }

  // Build adjacency list
  const graph = new Map<string, Set<string>>();
  
  // Add existing edges
  existingEdges.forEach((edge) => {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, new Set());
    }
    graph.get(edge.source)!.add(edge.target);
  });

  // Add the new edge we're testing
  if (!graph.has(sourceNodeId)) {
    graph.set(sourceNodeId, new Set());
  }
  graph.get(sourceNodeId)!.add(targetNodeId);

  // Check for cycle using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycleDFS(node: string): boolean {
    visited.add(node);
    recursionStack.add(node);

    const neighbors = graph.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleDFS(neighbor)) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  // Check from the source node
  return hasCycleDFS(sourceNodeId);
}

/**
 * Get all possible target ports for a given source port
 * Useful for UI hints and autocomplete
 */
export function getCompatibleTargetPorts(
  sourcePort: DevicePort,
  availablePorts: DevicePort[]
): DevicePort[] {
  if (sourcePort.direction !== 'output') {
    return [];
  }

  return availablePorts.filter((targetPort) => {
    if (targetPort.direction !== 'input') {
      return false;
    }
    return areSignalTypesCompatible(sourcePort.signalType, targetPort.signalType);
  });
}

/**
 * Validate an entire connection setup
 * Checks for common issues like unconnected inputs, multiple connections to same input, etc.
 */
export interface SetupValidationIssue {
  type: 'error' | 'warning' | 'info';
  nodeId?: string;
  portId?: string;
  message: string;
}

export function validateSetup(
  nodes: Array<{ id: string; data: { ports: DevicePort[] } }>,
  edges: Array<{ source: string; sourceHandle: string; target: string; targetHandle: string }>
): SetupValidationIssue[] {
  const issues: SetupValidationIssue[] = [];

  // Check for unconnected ports (optional, just warnings)
  nodes.forEach((node) => {
    const connectedPorts = new Set<string>();
    edges.forEach((edge) => {
      if (edge.source === node.id) {
        connectedPorts.add(edge.sourceHandle);
      }
      if (edge.target === node.id) {
        connectedPorts.add(edge.targetHandle);
      }
    });

    node.data.ports.forEach((port) => {
      if (!connectedPorts.has(port.id)) {
        issues.push({
          type: 'info',
          nodeId: node.id,
          portId: port.id,
          message: `Port "${port.name}" is not connected`,
        });
      }
    });
  });

  // Check for multiple connections to the same input
  const inputConnections = new Map<string, number>();
  edges.forEach((edge) => {
    const key = `${edge.target}-${edge.targetHandle}`;
    inputConnections.set(key, (inputConnections.get(key) || 0) + 1);
  });

  inputConnections.forEach((count, key) => {
    if (count > 1) {
      const [nodeId, portId] = key.split('-');
      issues.push({
        type: 'warning',
        nodeId,
        portId,
        message: `Input port has ${count} connections (signal mixing may occur)`,
      });
    }
  });

  return issues;
}

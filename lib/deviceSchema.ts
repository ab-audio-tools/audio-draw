/**
 * Device Schema and Type Definitions
 * Defines the structure for audio devices, ports, and signal types
 */

/**
 * Signal types supported by the audio patchbay
 */
export type SignalType =
  | 'audio-mono'
  | 'audio-stereo'
  | 'midi'
  | 'digital-audio'
  | 'digital-midi'
  | 'power'
  | 'control'
  | 'spdif'
  | 'adat'
  | 'dante';

/**
 * Connector types for ports
 */
export type ConnectorType =
  | 'xlr'
  | 'jack-ts'
  | 'jack-trs'
  | 'rca'
  | 'midi-din'
  | 'usb'
  | 'ethernet'
  | 'optical'
  | 'iec'
  | 'speakon';

/**
 * Cable path types
 */
export type CablePathType = 'bezier' | 'straight' | 'step' | 'smoothstep';

/**
 * Cable stroke types
 */
export type CableStrokeType = 'solid' | 'dashed' | 'dotted';

/**
 * Direction of a port (input or output)
 */
export type PortDirection = 'input' | 'output';

/**
 * Port definition for a device
 */
export interface DevicePort {
  id: string;
  name: string;
  direction: PortDirection;
  signalType: SignalType;
  connectorType?: ConnectorType; // Type of physical connector
  position?: number; // Optional position for ordering
}

/**
 * Cable/Edge properties
 */
export interface CableProperties {
  color?: string;
  strokeWidth?: number;
  strokeType?: CableStrokeType;
  pathType?: CablePathType;
  animated?: boolean;
  label?: string;
}

/**
 * Device metadata
 */
export interface DeviceMeta {
  manufacturer?: string;
  model?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Device schema stored as JSON in database
 */
export interface DeviceSchema {
  ports: DevicePort[];
  meta?: DeviceMeta;
}

/**
 * Complete device type
 */
export interface Device {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  schemaJson: string; // JSON string of DeviceSchema
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parsed device with schema object
 */
export interface ParsedDevice extends Omit<Device, 'schemaJson'> {
  schema: DeviceSchema;
}

/**
 * Project data structure
 */
export interface ProjectData {
  version: string;
  nodes: DeviceNode[];
  edges: DeviceEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

/**
 * Device node in the editor
 */
export interface DeviceNode {
  id: string;
  type: 'device';
  position: { x: number; y: number };
  data: {
    deviceId: string;
    deviceName: string;
    deviceSlug: string;
    imageUrl: string | null;
    ports: DevicePort[];
    meta?: DeviceMeta;
  };
}

/**
 * Connection edge between devices
 */
export interface DeviceEdge {
  id: string;
  source: string; // Node ID
  sourceHandle: string; // Port ID
  target: string; // Node ID
  targetHandle: string; // Port ID
  type?: string;
  animated?: boolean;
  data?: {
    signalType: SignalType;
    label?: string;
    gain?: number;
  };
}

/**
 * Project model
 */
export interface Project {
  id: string;
  name: string;
  description: string | null;
  data: string; // JSON string of ProjectData
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parsed project with data object
 */
export interface ParsedProject extends Omit<Project, 'data'> {
  data: ProjectData;
}

/**
 * Helper function to parse device schema
 */
export function parseDeviceSchema(schemaJson: string): DeviceSchema {
  try {
    return JSON.parse(schemaJson) as DeviceSchema;
  } catch (error) {
    console.error('Failed to parse device schema:', error);
    return { ports: [], meta: {} };
  }
}

/**
 * Helper function to parse project data
 */
export function parseProjectData(dataJson: string): ProjectData {
  try {
    return JSON.parse(dataJson) as ProjectData;
  } catch (error) {
    console.error('Failed to parse project data:', error);
    return {
      version: '1.0.0',
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    };
  }
}

/**
 * Helper to convert Device to ParsedDevice
 */
export function parseDevice(device: Device): ParsedDevice {
  return {
    ...device,
    schema: parseDeviceSchema(device.schemaJson),
  };
}

/**
 * Helper to convert Project to ParsedProject
 */
export function parseProject(project: Project): ParsedProject {
  return {
    ...project,
    data: parseProjectData(project.data),
  };
}

/**
 * Signal type compatibility matrix
 * Maps signal types to compatible target types
 */
export const SIGNAL_COMPATIBILITY: Record<SignalType, SignalType[]> = {
  'audio-mono': ['audio-mono', 'audio-stereo'],
  'audio-stereo': ['audio-stereo'],
  midi: ['midi'],
  'digital-audio': ['digital-audio'],
  'digital-midi': ['digital-midi', 'midi'],
  power: ['power'],
  control: ['control'],
  spdif: ['spdif', 'digital-audio'],
  adat: ['adat', 'digital-audio'],
  dante: ['dante', 'digital-audio'],
};

/**
 * Get label for signal type
 */
export function getSignalTypeLabel(type: SignalType): string {
  const labels: Record<SignalType, string> = {
    'audio-mono': 'Mono Audio',
    'audio-stereo': 'Stereo Audio',
    'midi': 'MIDI',
    'digital-audio': 'Digital Audio',
    'digital-midi': 'Digital MIDI',
    'power': 'Power',
    'control': 'Control',
    'spdif': 'S/PDIF',
    'adat': 'ADAT',
    'dante': 'Dante',
  };

  return labels[type] || type;
}

/**
 * Get default connector type for signal type
 */
export function getDefaultConnectorType(signalType: SignalType): ConnectorType {
  const defaults: Record<SignalType, ConnectorType> = {
    'audio-mono': 'xlr',
    'audio-stereo': 'jack-trs',
    'midi': 'midi-din',
    'digital-audio': 'usb',
    'digital-midi': 'usb',
    'power': 'iec',
    'control': 'ethernet',
    'spdif': 'rca',
    'adat': 'optical',
    'dante': 'ethernet',
  };

  return defaults[signalType] || 'xlr';
}

/**
 * Get connector icon/label
 */
export function getConnectorLabel(type: ConnectorType): string {
  const labels: Record<ConnectorType, string> = {
    'xlr': 'XLR',
    'jack-ts': '1/4" TS',
    'jack-trs': '1/4" TRS',
    'rca': 'RCA',
    'midi-din': 'MIDI DIN',
    'usb': 'USB',
    'ethernet': 'RJ45',
    'optical': 'Optical',
    'iec': 'IEC',
    'speakon': 'Speakon',
  };

  return labels[type] || type;
}

/**
 * Get color for signal type (for UI representation)
 */
export function getSignalTypeColor(signalType: SignalType): string {
  const colors: Record<SignalType, string> = {
    'audio-mono': '#3b82f6', // blue
    'audio-stereo': '#8b5cf6', // purple
    midi: '#f59e0b', // amber
    'digital-audio': '#06b6d4', // cyan
    'digital-midi': '#f97316', // orange
    power: '#ef4444', // red
    control: '#10b981', // green
    spdif: '#14b8a6', // teal
    adat: '#6366f1', // indigo
    dante: '#ec4899', // pink
  };
  return colors[signalType] || '#6b7280'; // gray as fallback
}

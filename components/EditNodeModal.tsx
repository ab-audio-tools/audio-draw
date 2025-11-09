/**
 * EditNodeModal - Modal for editing device node ports (inputs/outputs)
 */

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { DevicePort, SignalType, ConnectorType } from '@/lib/deviceSchema';
import { getSignalTypeColor, getDefaultConnectorType } from '@/lib/deviceSchema';
import ConnectorIcon from './ConnectorIcon';

interface EditNodeModalProps {
  nodeName: string;
  ports: DevicePort[];
  onSave: (ports: DevicePort[]) => void;
  onClose: () => void;
}

export default function EditNodeModal({ nodeName, ports, onSave, onClose }: EditNodeModalProps) {
  const [editedPorts, setEditedPorts] = useState<DevicePort[]>(JSON.parse(JSON.stringify(ports)));

  const addPort = (direction: 'input' | 'output') => {
    const newPort: DevicePort = {
      id: `port-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: direction === 'input' ? 'Input' : 'Output',
      direction,
      signalType: 'line' as SignalType,
      connectorType: 'jack-ts' as ConnectorType,
    };
    setEditedPorts([...editedPorts, newPort]);
  };

  const updatePort = (index: number, updates: Partial<DevicePort>) => {
    const updated = [...editedPorts];
    updated[index] = { ...updated[index], ...updates };
    setEditedPorts(updated);
  };

  const deletePort = (index: number) => {
    setEditedPorts(editedPorts.filter((_, i) => i !== index));
  };

  const inputPorts = editedPorts.filter((p) => p.direction === 'input');
  const outputPorts = editedPorts.filter((p) => p.direction === 'output');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
      <div className="w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">Edit Node: {nodeName}</h2>
          <button
            onClick={onClose}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Input Ports */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-900">Input Ports</h3>
                <button
                  onClick={() => addPort('input')}
                  className="flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white hover:bg-blue-700"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {inputPorts.length === 0 ? (
                  <p className="text-xs text-gray-500">No input ports</p>
                ) : (
                  inputPorts.map((port, idx) => {
                    const globalIdx = editedPorts.findIndex((p) => p.id === port.id);
                    return (
                      <PortEditor
                        key={port.id}
                        port={port}
                        onChange={(updates) => updatePort(globalIdx, updates)}
                        onDelete={() => deletePort(globalIdx)}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Output Ports */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-900">Output Ports</h3>
                <button
                  onClick={() => addPort('output')}
                  className="flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white hover:bg-blue-700"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {outputPorts.length === 0 ? (
                  <p className="text-xs text-gray-500">No output ports</p>
                ) : (
                  outputPorts.map((port, idx) => {
                    const globalIdx = editedPorts.findIndex((p) => p.id === port.id);
                    return (
                      <PortEditor
                        key={port.id}
                        port={port}
                        onChange={(updates) => updatePort(globalIdx, updates)}
                        onDelete={() => deletePort(globalIdx)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - fixed at bottom */}
        <div className="flex justify-end gap-2 border-t border-gray-200 bg-white px-3 py-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(editedPorts);
              onClose();
            }}
            className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

interface PortEditorProps {
  port: DevicePort;
  onChange: (updates: Partial<DevicePort>) => void;
  onDelete: () => void;
}

function PortEditor({ port, onChange, onDelete }: PortEditorProps) {
  const color = getSignalTypeColor(port.signalType);
  const connectorType = port.connectorType || getDefaultConnectorType(port.signalType);

  return (
    <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 p-1">
      {/* Connector Preview */}
      <div
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: 'white', border: `1.5px solid ${color}` }}
      >
        <ConnectorIcon type={connectorType} size={10} color={color} />
      </div>

      {/* Port Name */}
      <input
        type="text"
        value={port.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="flex-1 min-w-[60px] rounded border border-gray-300 px-1 py-0.5 text-xs leading-tight"
        placeholder="Name"
      />

      {/* Signal Type */}
      <select
        value={port.signalType}
        onChange={(e) => onChange({ signalType: e.target.value as SignalType })}
        className="rounded border border-gray-300 px-1 py-0.5 text-[10px] leading-tight w-16"
      >
        <option value="line">Line</option>
        <option value="mic">Mic</option>
        <option value="instrument">Inst</option>
        <option value="speaker">Spk</option>
        <option value="digital">Dig</option>
        <option value="midi">MIDI</option>
        <option value="power">Pwr</option>
      </select>

      {/* Connector Type */}
      <select
        value={connectorType}
        onChange={(e) => onChange({ connectorType: e.target.value as ConnectorType })}
        className="rounded border border-gray-300 px-1 py-0.5 text-[10px] leading-tight w-20"
      >
        <option value="xlr">XLR</option>
        <option value="jack-ts">TS</option>
        <option value="jack-trs">TRS</option>
        <option value="rca">RCA</option>
        <option value="midi-din">MIDI</option>
        <option value="usb">USB</option>
        <option value="ethernet">ETH</option>
        <option value="optical">OPT</option>
        <option value="speakon">SPK</option>
        <option value="iec">IEC</option>
      </select>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 rounded p-0.5 text-red-600 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

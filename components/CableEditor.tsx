/**
 * CableEditor - Panel for editing cable properties
 */

import React from 'react';
import { Edge } from 'reactflow';
import { X } from 'lucide-react';
import type { CablePathType, CableStrokeType } from '@/lib/deviceSchema';
import { getSignalTypeColor } from '@/lib/deviceSchema';

interface CableEditorProps {
  edge: Edge;
  onUpdate: (edgeId: string, data: Partial<Edge['data']>) => void;
  onClose: () => void;
}

export default function CableEditor({ edge, onUpdate, onClose }: CableEditorProps) {
  const handleColorChange = (color: string) => {
    onUpdate(edge.id, { ...edge.data, color });
  };

  const handleStrokeWidthChange = (width: number) => {
    onUpdate(edge.id, { ...edge.data, strokeWidth: width });
  };

  const handleStrokeTypeChange = (strokeType: CableStrokeType) => {
    onUpdate(edge.id, { ...edge.data, strokeType });
  };

  const handlePathTypeChange = (pathType: CablePathType) => {
    onUpdate(edge.id, { ...edge.data, pathType });
  };

  const handleAnimatedChange = (animated: boolean) => {
    onUpdate(edge.id, { ...edge.data, animated });
  };

  const handleLabelChange = (label: string) => {
    onUpdate(edge.id, { ...edge.data, label });
  };

  const currentColor = edge.data?.color || getSignalTypeColor(edge.data?.signalType || 'audio-mono');
  const currentStrokeWidth = edge.data?.strokeWidth || 2.5;
  const currentStrokeType = edge.data?.strokeType || 'solid';
  const currentPathType = edge.data?.pathType || 'bezier';
  const currentAnimated = edge.data?.animated || false;
  const currentLabel = edge.data?.label || '';

  const presetColors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Black', value: '#1f2937' },
  ];

  return (
    <div className="fixed right-4 top-20 z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="font-semibold text-gray-900">Edit Cable</h3>
        <button
          onClick={onClose}
          className="rounded p-1 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Color Picker */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleColorChange(preset.value)}
              className="group relative h-10 rounded border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: preset.value,
                borderColor: currentColor === preset.value ? '#1f2937' : 'transparent',
              }}
              title={preset.name}
            >
              {currentColor === preset.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="mt-2 h-10 w-full cursor-pointer rounded border border-gray-300"
        />
      </div>

      {/* Stroke Width */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Thickness: {currentStrokeWidth}px
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={currentStrokeWidth}
          onChange={(e) => handleStrokeWidthChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Stroke Type */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Line Style</label>
        <div className="grid grid-cols-3 gap-2">
          {(['solid', 'dashed', 'dotted'] as CableStrokeType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleStrokeTypeChange(type)}
              className={`rounded border-2 px-3 py-2 text-sm font-medium capitalize transition-all ${
                currentStrokeType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Path Type */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Path Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(['bezier', 'straight', 'step', 'smoothstep'] as CablePathType[]).map((type) => (
            <button
              key={type}
              onClick={() => handlePathTypeChange(type)}
              className={`rounded border-2 px-3 py-2 text-sm font-medium capitalize transition-all ${
                currentPathType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Animated */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={currentAnimated}
            onChange={(e) => handleAnimatedChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Animated</span>
        </label>
      </div>

      {/* Label */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Label (optional)</label>
        <input
          type="text"
          value={currentLabel}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Cable label..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

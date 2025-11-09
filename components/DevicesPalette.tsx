/**
 * DevicesPalette - Left sidebar with draggable device library
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { Button } from '@/components/ui/button';
// Use native <img> to avoid Next Image fetchPriority warnings in some React versions

interface DevicesPaletteProps {
  onAddDevice?: () => void;
}

export default function DevicesPalette({ onAddDevice }: DevicesPaletteProps) {
  const { devices, loading } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.schema.meta?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: React.DragEvent, deviceId: string) => {
    event.dataTransfer.setData('application/reactflow', 'device');
    event.dataTransfer.setData('deviceId', deviceId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Device Library</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Add Device Button */}
        <Button
          onClick={onAddDevice}
          className="mt-3 w-full"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Device
        </Button>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading devices...</div>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">No devices found</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDevices.map((device) => (
              <motion.div
                key={device.id}
                draggable
                onDragStart={(e) => handleDragStart(e as any, device.id)}
                className="cursor-move rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-400 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {device.imageUrl && (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={device.imageUrl}
                        alt={device.name}
                        className="object-cover w-full h-full"
                        onError={(e: any) => {
                          e.currentTarget.src = '/placeholder-device.svg';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {device.name}
                    </h3>
                    {device.schema.meta?.category && (
                      <p className="truncate text-xs text-gray-500">
                        {device.schema.meta.category}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {device.schema.ports.filter((p) => p.direction === 'input').length} in /{' '}
                      {device.schema.ports.filter((p) => p.direction === 'output').length} out
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

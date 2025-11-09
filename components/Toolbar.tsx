/**
 * Toolbar - Top toolbar with editor controls
 */

import React from 'react';
import {
  Undo,
  Redo,
  Save,
  Download,
  Upload,
  Grid3x3,
  ZoomIn,
  ZoomOut,
  Maximize,
} from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ToolbarProps {
  onSave?: () => void;
  onExportPNG?: () => void;
  onExportSVG?: () => void;
  onExportJSON?: () => void;
  onImportJSON?: () => void;
  onFitView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export default function Toolbar({
  onSave,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onImportJSON,
  onFitView,
  onZoomIn,
  onZoomOut,
}: ToolbarProps) {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    snapToGrid,
    setSnapToGrid,
    projectName,
    isDirty,
  } = useEditorStore();

  const handleUndo = () => {
    if (canUndo()) {
      undo();
      toast({ title: 'Undone' });
    }
  };

  const handleRedo = () => {
    if (canRedo()) {
      redo();
      toast({ title: 'Redone' });
    }
  };

  const toggleSnapToGrid = () => {
    setSnapToGrid(!snapToGrid);
    toast({
      title: snapToGrid ? 'Snap to Grid: Off' : 'Snap to Grid: On',
    });
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
      {/* Left Section - Project Name */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">
          {projectName}
          {isDirty && <span className="ml-2 text-gray-400">*</span>}
        </h1>
      </div>

      {/* Center Section - Main Controls */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Zoom Controls */}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onFitView} title="Fit View">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        {/* Grid Toggle */}
        <Button
          variant={snapToGrid ? 'default' : 'ghost'}
          size="icon"
          onClick={toggleSnapToGrid}
          title="Toggle Snap to Grid"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Right Section - Export/Save */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onImportJSON} title="Import JSON">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>

        <div className="relative group">
          <Button variant="ghost" size="sm" title="Export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="absolute right-0 top-full mt-1 hidden w-40 rounded-md border border-gray-200 bg-white shadow-lg group-hover:block">
            <button
              onClick={onExportPNG}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Export PNG
            </button>
            <button
              onClick={onExportSVG}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Export SVG
            </button>
            <button
              onClick={onExportJSON}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Export JSON
            </button>
          </div>
        </div>

        <Button onClick={onSave} size="sm" title="Save Project">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}

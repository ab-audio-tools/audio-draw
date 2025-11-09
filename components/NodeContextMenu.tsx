/**
 * NodeContextMenu - Custom right-click context menu for device nodes
 */

import React, { useEffect, useRef } from 'react';
import { Edit, Type, Trash2, Copy, Clipboard, Lock, Unlock } from 'lucide-react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  isLocked?: boolean;
  onEditNode: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onToggleLock: () => void;
  onClose: () => void;
}

export default function NodeContextMenu({
  x,
  y,
  isLocked = false,
  onEditNode,
  onRename,
  onDelete,
  onDuplicate,
  onCopy,
  onPaste,
  onToggleLock,
  onClose,
}: NodeContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add listeners immediately (no delay needed with portal)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Reposition if menu goes off-screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      if (adjustedX !== x || adjustedY !== y) {
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-xl"
      style={{ left: x, top: y }}
    >
      <div className="py-1">
        {/* Edit Node */}
        <button
          onClick={() => {
            onEditNode();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Node</span>
        </button>

        {/* Rename */}
        <button
          onClick={() => {
            onRename();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Type className="h-4 w-4" />
          <span>Rename</span>
          <span className="ml-auto text-xs text-gray-400">F2</span>
        </button>

        {/* Duplicate */}
        <button
          onClick={() => {
            onDuplicate();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span>Duplicate</span>
          <span className="ml-auto text-xs text-gray-400">Ctrl+D</span>
        </button>

        {/* Copy */}
        <button
          onClick={() => {
            onCopy();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Clipboard className="h-4 w-4" />
          <span>Copy</span>
          <span className="ml-auto text-xs text-gray-400">Ctrl+C</span>
        </button>

        {/* Paste */}
        <button
          onClick={() => {
            onPaste();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Clipboard className="h-4 w-4" />
          <span>Paste</span>
          <span className="ml-auto text-xs text-gray-400">Ctrl+V</span>
        </button>

        {/* Divider */}
        <div className="my-1 border-t border-gray-200" />

        {/* Lock/Unlock */}
        <button
          onClick={() => {
            onToggleLock();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {isLocked ? (
            <>
              <Unlock className="h-4 w-4" />
              <span>Unlock Position</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Lock Position</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="my-1 border-t border-gray-200" />

        {/* Delete */}
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
          <span className="ml-auto text-xs text-red-400">Del</span>
        </button>
      </div>
    </div>
  );
}

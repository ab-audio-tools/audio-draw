/**
 * ConnectionEdge - Custom React Flow Edge Component
 * Displays curved connections with validation feedback and customizable properties
 */

import React from 'react';
import { 
  EdgeProps, 
  getBezierPath, 
  getStraightPath,
  getSmoothStepPath,
  EdgeLabelRenderer 
} from 'reactflow';
import { motion } from 'framer-motion';
import { getSignalTypeColor } from '@/lib/deviceSchema';
import type { SignalType, CablePathType, CableStrokeType } from '@/lib/deviceSchema';

interface ConnectionEdgeData {
  signalType?: SignalType;
  label?: string;
  gain?: number;
  valid?: boolean;
  color?: string;
  strokeWidth?: number;
  strokeType?: CableStrokeType;
  pathType?: CablePathType;
  animated?: boolean;
}

export default function ConnectionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps<ConnectionEdgeData>) {
  const pathType = data?.pathType || 'bezier';
  
  // Get the appropriate path based on pathType
  let edgePath: string;
  let labelX: number;
  let labelY: number;

  if (pathType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (pathType === 'step' || pathType === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: pathType === 'smoothstep' ? 20 : 0,
    });
  } else {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  const color = data?.color || (data?.signalType ? getSignalTypeColor(data.signalType) : '#6b7280');
  const isValid = data?.valid !== false;
  const strokeWidth = data?.strokeWidth || 2.5;
  const strokeType = data?.strokeType || 'solid';
  const animated = data?.animated || false;

  // Calculate stroke dash array based on stroke type
  const getStrokeDashArray = () => {
    if (!isValid) return '5,5';
    if (strokeType === 'dashed') return '10,5';
    if (strokeType === 'dotted') return '2,4';
    return 'none';
  };

  return (
    <>
      {/* Invisible wider path for easier interaction */}
      <path
        d={edgePath}
        strokeWidth={20}
        stroke="transparent"
        fill="none"
        className="react-flow__edge-interaction"
      />

      {/* Edge Path */}
      <motion.path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        strokeWidth={selected ? strokeWidth + 1.5 : strokeWidth}
        stroke={isValid ? color : '#ef4444'}
        strokeDasharray={getStrokeDashArray()}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1,
          strokeDashoffset: animated ? [0, -20] : 0,
        }}
        transition={{ 
          duration: 0.3,
          strokeDashoffset: {
            duration: 1,
            repeat: animated ? Infinity : 0,
            ease: 'linear',
          }
        }}
        style={{
          ...style,
          cursor: 'pointer',
        }}
      />

      {/* Selection Highlight with glow */}
      {selected && (
        <>
          <path
            d={edgePath}
            strokeWidth={12}
            stroke={color}
            fill="none"
            opacity={0.15}
            pointerEvents="none"
            filter="blur(4px)"
          />
          <path
            d={edgePath}
            strokeWidth={4}
            stroke={color}
            fill="none"
            opacity={0.4}
            pointerEvents="none"
          />
        </>
      )}

      {/* Edge Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded bg-white px-2 py-1 text-xs font-medium shadow-md"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              {data.label}
            </motion.div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

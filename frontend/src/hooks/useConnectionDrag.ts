import { useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { type Connection, type ConnectionPoint } from '../types/component';

interface DragState {
  isDragging: boolean;
  startPoint?: ConnectionPoint;
  sourceComponentId?: string;
  currentPosition: { x: number; y: number };
}

interface UseConnectionDragProps {
  onConnectionCreated: (connection: Connection) => void;
}

export function useConnectionDrag({ onConnectionCreated }: UseConnectionDragProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    currentPosition: { x: 0, y: 0 }
  });

  useDndMonitor({
    onDragStart(event) {
      const { active } = event;
      if (active.data.current?.type !== 'connection-point') return;

      const { pointType, parentComponentId, pointId } = active.data.current;
      if (pointType !== 'output') return;

      setDragState({
        isDragging: true,
        startPoint: {
          id: pointId,
          type: 'output',
          position: active.data.current.position,
          connected: false
        },
        sourceComponentId: parentComponentId,
        currentPosition: { x: active.rect.current.translated?.left ?? 0, y: active.rect.current.translated?.top ?? 0 }
      });
    },

    onDragMove(event) {
      if (!dragState.isDragging) return;

      setDragState(prev => ({
        ...prev,
        currentPosition: { x: event.delta.x, y: event.delta.y }
      }));
    },

    onDragEnd(event) {
      if (!dragState.isDragging) return;

      const { over } = event;
      if (!over || !dragState.startPoint || !dragState.sourceComponentId) {
        setDragState({
          isDragging: false,
          currentPosition: { x: 0, y: 0 }
        });
        return;
      }

      const { data } = over;
      if (data.current?.type !== 'connection-point' || data.current?.pointType !== 'input') {
        setDragState({
          isDragging: false,
          currentPosition: { x: 0, y: 0 }
        });
        return;
      }

      // Create the connection
      onConnectionCreated({
        sourceId: dragState.startPoint.id,
        targetId: data.current.pointId,
        sourceComponentId: dragState.sourceComponentId,
        targetComponentId: data.current.parentComponentId
      });

      setDragState({
        isDragging: false,
        currentPosition: { x: 0, y: 0 }
      });
    },

    onDragCancel() {
      setDragState({
        isDragging: false,
        currentPosition: { x: 0, y: 0 }
      });
    }
  });

  return dragState;
}
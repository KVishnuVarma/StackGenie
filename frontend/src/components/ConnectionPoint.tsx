import { useDraggable, useDroppable } from '@dnd-kit/core';
import { type CSSProperties } from 'react';

interface ConnectionPointProps {
  id: string;
  type: 'input' | 'output';
  position: 'top' | 'right' | 'bottom' | 'left';
  parentComponentId: string;
}

export default function ConnectionPoint({
  id,
  type,
  position,
  parentComponentId
}: ConnectionPointProps): React.ReactElement {
  const draggable = useDraggable({
    id: `${id}-drag`,
    data: {
      type: 'connection-point',
      pointType: type,
      parentComponentId,
      pointId: id
    }
  });

  // Droppable setup for input points (where connection ends)
  const droppable = useDroppable({
    id: `${id}-drop`,
    data: {
      type: 'connection-point',
      pointType: type,
      parentComponentId,
      pointId: id
    }
  });

  // Position styles based on the point's position on the component
  const getPositionStyle = (): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#4F46E5',
      border: '2px solid #fff',
      boxShadow: '0 0 0 1px #4F46E5',
      cursor: type === 'output' ? 'grab' : 'default',
      zIndex: 10
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'right':
        return {
          ...base,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return {
          ...base,
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          ...base,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)'
        };
    }
  };

  // Set attributes based on point type
  const attributes = type === 'output' ? draggable.attributes : {};
  const listeners = type === 'output' ? draggable.listeners : {};
  const ref = type === 'output' ? draggable.setNodeRef : droppable.setNodeRef;

  return (
    <div
      ref={ref}
      style={getPositionStyle()}
      {...attributes}
      {...listeners}
      className={`connection-point ${type === 'input' ? 'connection-point-input' : 'connection-point-output'}`}
      data-position={position}
      data-type={type}
    />
  );
}
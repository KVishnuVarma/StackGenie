import { useEffect, useState } from 'react';

interface ConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  thickness?: number;
  animate?: boolean;
}

export default function Connection({
  startX,
  startY,
  endX,
  endY,
  color = '#4F46E5',
  thickness = 2,
  animate = true
}: ConnectionProps) {
  const [length, setLength] = useState(0);
  const [path, setPath] = useState('');

  useEffect(() => {
    // Calculate the path for a smooth curve between points
    const dx = endX - startX;
    const dy = endY - startY;
    const controlPoint1X = startX + dx * 0.5;
    const controlPoint1Y = startY;
    const controlPoint2X = startX + dx * 0.5;
    const controlPoint2Y = endY;

    // Create a cubic bezier curve path
    const newPath = `M ${startX},${startY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;
    setPath(newPath);

    // Calculate the length of the path for animation
    if (animate) {
      const length = Math.sqrt(dx * dx + dy * dy);
      setLength(length);
    }
  }, [startX, startY, endX, endY, animate]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {animate ? (
        <path
          d={path}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={length}
          strokeDashoffset={length}
          style={{
            animation: 'connection-draw 0.5s ease forwards'
          }}
        />
      ) : (
        <path
          d={path}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
        />
      )}
      
      {/* Arrow head */}
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon
          points="0 0, 10 3.5, 0 7"
          fill={color}
        />
      </marker>
    </svg>
  );
}

// Add the animation keyframes to your global CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes connection-draw {
    to {
      stroke-dashoffset: 0;
    }
  }
`;
document.head.appendChild(styleSheet);
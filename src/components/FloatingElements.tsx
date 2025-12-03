import React, { useEffect, useState } from 'react';
import '@/styles/animations.css';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'circle' | 'square' | 'triangle';
  color: string;
}

const FloatingElements = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const types: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];

    const generatedElements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setElements(generatedElements);
  }, []);

  const renderShape = (element: FloatingElement) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      backgroundColor: element.color,
      opacity: 0.1,
      animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
    };

    switch (element.type) {
      case 'circle':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              borderRadius: '50%',
            }}
          />
        );
      case 'square':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              borderRadius: '8px',
              transform: 'rotate(45deg)',
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map(element => renderShape(element))}
    </div>
  );
};

export default FloatingElements;

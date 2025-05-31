import React, { useState } from 'react';
import ObjectItemCard from './ObjectItemCard';

export default function ObjectsPanel({ objects, onAdd, onRemove }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        top: 480,
        zIndex: 9999,
        width: '240px',
        backgroundColor: '#ffffffee',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'monospace',
      }}
    >
      {/* Header */}
      <div
        onClick={toggleOpen}
        style={{
          cursor: 'pointer',
          padding: '10px 12px',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #ccc',
          userSelect: 'none',  // 👈 prevent blue highlight

        }}
      >
        🎛️ Add Objects 
        <span
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            userSelect: 'none',  // 👈 prevent blue highlight
            userSelect: 'none',  // 👈 prevent blue highlight


          }}
        >
          ▶
        </span>
      </div>

      {/* Collapsible content */}
      <div
        style={{
          maxHeight: isOpen ? '1000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          userSelect: 'none',  // 👈 prevent blue highlight

        }}
      >
        <div style={{ padding: '12px' }}>
          {objects.map((obj) => (
            <ObjectItemCard
              key={obj.name}
              name={obj.name}
              count={obj.count}
              onAdd={() => onAdd(obj.name)}
              onRemove={() => onRemove(obj.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

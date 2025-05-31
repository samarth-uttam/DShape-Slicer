import React from 'react';

export default function ObjectItemCard({ name, count, onAdd, onRemove }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f2',
        padding: '8px 12px',
        borderRadius: '8px',
        marginBottom: '6px',
        fontFamily: 'monospace',
        fontSize: '14px',
      }}
    >
      <span style={{ width: '80px' }}>{name}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onRemove}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            backgroundColor: '#ddd',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          −
        </button>

        <span>{count}</span>

        <button
          onClick={onAdd}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            backgroundColor: '#ddd',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

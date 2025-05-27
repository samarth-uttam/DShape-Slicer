import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import 'remixicon/fonts/remixicon.css';
import { useSceneStore } from '../../../Store/sceneStore';
import * as THREE from 'three';

export default function TransformObjectGUI({ selectedIds }) {
  const selectedId = selectedIds[0];
  const selectedPlateId = useSceneStore((s) => s.selectedPlateId);
  const updateObjectTransform = useSceneStore((s) => s.updateObjectTransform);

  const [activeTool, setActiveTool] = useState(null);
  const [scaleLocked, setScaleLocked] = useState(true);
  const panelRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setActiveTool(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const transform = useSceneStore.getState()
    .plates.find((p) => p.id === selectedPlateId)
    ?.objects.find((o) => o.id === selectedId);

  const isDisabled = !transform;
  const axisIndex = (axis) => (axis === 'x' ? 0 : axis === 'y' ? 1 : 2);

  const updateValue = (tool, axis, delta) => {
    if (!transform) return;
    const updated = {
      position: [...transform.position],
      rotation: [...transform.rotation],
      scale: [...transform.scale],
    };

    if (tool === 'translate') {
      updated.position[axisIndex(axis)] += delta;
    } else if (tool === 'rotate') {
      updated.rotation[axisIndex(axis)] += (delta * Math.PI) / 180;
    } else if (tool === 'scale') {
      const newVal = updated.scale[axisIndex(axis)] + delta;
      const clamped = Math.min(Math.max(newVal, 0.1), 5);

      if (scaleLocked) {
        updated.scale = [clamped, clamped, clamped];
      } else {
        updated.scale[axisIndex(axis)] = clamped;
      }
    }

    updateObjectTransform(selectedPlateId, selectedId, updated);
  };

  const resetTool = () => {
    if (!transform || !activeTool) return;
    const original = transform.original;
    if (!original) return;

    const reset = {
      position: [...transform.position],
      rotation: [...transform.rotation],
      scale: [...transform.scale],
    };

    if (activeTool === 'translate') reset.position = [...original.position];
    if (activeTool === 'rotate') reset.rotation = [...original.rotation];
    if (activeTool === 'scale') reset.scale = [...original.scale];

    updateObjectTransform(selectedPlateId, selectedId, reset);
  };

  const buttons = [
    { key: 'translate', iconClass: 'ri-drag-move-2-fill', label: 'Translate' },
    { key: 'rotate', iconClass: 'ri-clockwise-2-line', label: 'Rotate' },
    { key: 'scale', iconClass: 'ri-expand-diagonal-line', label: 'Scale' },
  ];

  const axisColors = { x: '#ff0000', y: '#00aa00', z: '#0000ff' };

  const stepperBtn = {
    border: 'none',
    background: '#ddd',
    padding: '1px 0',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    outline: 'none',
    boxShadow: 'none',
  };

const handleScaleLockToggle = () => {
  if (!transform) return;

  const { scale } = transform;
  const smallest = Math.max(0.1, Math.min(...scale));

  // Toggle lock state
  const nextLocked = !scaleLocked;
  setScaleLocked(nextLocked);

  // If locking, immediately set all axes to the smallest value
  if (nextLocked) {
    updateObjectTransform(selectedPlateId, selectedId, {
      ...transform,
      scale: [smallest, smallest, smallest],
    });
  }
};



  return (
    <>
      {/* Toolbar */}
      <div
        style={{
          position: 'absolute',
          left: '550px',
          bottom: '20px',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1px',
          backgroundColor: isDisabled ? 'rgba(236, 237, 243, 0.4)' : 'rgba(202, 202, 214, 0.8)',
          padding: '8px 12px',
          borderRadius: '10px',
          zIndex: 9999,
          pointerEvents: isDisabled ? 'none' : 'auto',
          cursor: isDisabled ? 'not-allowed' : 'default',
        }}
      >
        {buttons.map((btn) => (
          <button
            key={btn.key}
            title={btn.label}
            onClick={() => setActiveTool((prev) => (prev === btn.key ? null : btn.key))}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              color: activeTool === btn.key ? '#000' : 'black',
              outline: 'none',
              boxShadow: 'none',
              position: 'relative',
            }}
          >
            <i className={btn.iconClass} style={{ fontSize: '20px' }}></i>
            {activeTool === btn.key && !isDisabled && (
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderBottom: '6px solid black',
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Control Panel */}
      {activeTool && transform &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'absolute',
              left: '550px',
              bottom: '75px',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(216, 217, 224, 0.92)',
              padding: '10px 12px',
              borderRadius: '10px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
              fontFamily: 'monospace',
              fontSize: '13px',
              zIndex: 9999,
              width: '220px',
              textAlign: 'center',
            }}
          >
            <strong style={{ textTransform: 'capitalize', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              {activeTool} Controls
            </strong>

            {/* Lock Toggle for Scale */}
            {activeTool === 'scale' && (
              <div style={{ marginBottom: '8px' }}>
                <button
                  onClick={handleScaleLockToggle}
                  style={{
                    backgroundColor: scaleLocked ? '#bbb' : '#eee',
                    border: '1px solid #888',
                    borderRadius: '6px',
                    fontSize: '12px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  {scaleLocked ? '🔒 Locked' : '🔓 Unlocked'}
                </button>
              </div>
            )}

            {['x', 'y', 'z'].map((axis) => (
              <div
                key={axis}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '6px',
                }}
              >
                <span style={{ width: '12px', fontWeight: 600, color: axisColors[axis] }}>{axis}</span>
                <input
                  type="text"
                  readOnly
                  value={
                    activeTool === 'translate'
                      ? `${transform.position[axisIndex(axis)].toFixed(2)} cm`
                      : activeTool === 'rotate'
                      ? `${(transform.rotation[axisIndex(axis)] * 180 / Math.PI).toFixed(0)}°`
                      : `${transform.scale[axisIndex(axis)].toFixed(2)}`
                  }
                  style={{
                    width: '80px',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    border: '1px solid #bbb',
                    borderRadius: '4px',
                    backgroundColor: '#f3f3f3',
                    color: '#222',
                    textAlign: 'right',
                  }}
                />
                <button style={stepperBtn} onClick={() => updateValue(activeTool, axis, activeTool === 'rotate' ? -30 : -0.1)}>−</button>
                <button style={stepperBtn} onClick={() => updateValue(activeTool, axis, activeTool === 'rotate' ? 30 : 0.1)}>+</button>
              </div>
            ))}

            <div style={{ marginTop: '8px' }}>
              <button
                onClick={resetTool}
                style={{
                  backgroundColor: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import 'remixicon/fonts/remixicon.css';

export default function TransformObjectGUI({ selectedId }) {
  const [activeTool, setActiveTool] = useState(null);
  const [scaleLocked, setScaleLocked] = useState(true);

  const [dummyValues, setDummyValues] = useState({
    translate: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  });

  const TOOLBAR_LEFT_PX = 550;
  const TOOLBAR_BOTTOM_PX = 20;
  const PANEL_BOTTOM_PX = 75;

  const handleToolClick = (tool) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const updateValue = (tool, axis, delta) => {
    setDummyValues((prev) => {
      const updated = { ...prev[tool] };
      const newValue = parseFloat((updated[axis] + delta).toFixed(2));

      if (tool === 'scale' && scaleLocked) {
        return {
          ...prev,
          scale: { x: newValue, y: newValue, z: newValue },
        };
      } else {
        updated[axis] = newValue;
        return {
          ...prev,
          [tool]: updated,
        };
      }
    });
  };

  const syncScaleToSmallest = () => {
    const { x, y, z } = dummyValues.scale;
    const smallest = Math.min(x, y, z);
    setDummyValues((prev) => ({
      ...prev,
      scale: { x: smallest, y: smallest, z: smallest },
    }));
  };

  const resetValues = (tool) => {
    const defaults = {
      translate: { x: 0, y: 0, z: 0 },
      rotate: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };
    setDummyValues((prev) => ({ ...prev, [tool]: defaults[tool] }));
  };

  const axisColors = {
    x: '#ff0000',
    y: '#00aa00',
    z: '#0000ff',
  };

  const buttons = [
    { key: 'translate', iconClass: 'ri-drag-move-2-fill', label: 'Translate' },
    { key: 'rotate', iconClass: 'ri-clockwise-2-line', label: 'Rotate' },
    { key: 'scale', iconClass: 'ri-expand-diagonal-line', label: 'Scale' },
  ];

  const valueInputStyle = {
    width: '80px',
    padding: '2px 6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    border: '1px solid #bbb',
    borderRadius: '4px',
    backgroundColor: '#f3f3f3',
    color: '#222',
    outline: 'none',
    boxShadow: 'none',
    textAlign: 'right',
  };

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

  return (
    <>
      {/* Bottom Toolbar */}
      <div
        style={{
          position: 'absolute',
          left: `${TOOLBAR_LEFT_PX}px`,
          bottom: `${TOOLBAR_BOTTOM_PX}px`,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1px',
          backgroundColor: 'rgba(202, 202, 214, 0.8)',
          padding: '8px 12px',
          borderRadius: '10px',
          zIndex: 9999,
        }}
      >
        {buttons.map((btn) => (
          <button
            key={btn.key}
            title={btn.label}
            onClick={() => handleToolClick(btn.key)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
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
            {activeTool === btn.key && (
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

      {/* Floating Panel */}
      {activeTool &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              left: `${TOOLBAR_LEFT_PX}px`,
              bottom: `${PANEL_BOTTOM_PX}px`,
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

            {(activeTool === 'translate' || activeTool === 'rotate') &&
              ['x', 'y', 'z'].map((axis) => (
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
                    value={`${dummyValues[activeTool][axis].toFixed(2)} ${activeTool === 'rotate' ? '°' : 'cm'}`}
                    readOnly
                    style={valueInputStyle}
                  />
                  <button style={stepperBtn} onClick={() => updateValue(activeTool, axis, activeTool === 'rotate' ? -30 : -1)}>−</button>
                  <button style={stepperBtn} onClick={() => updateValue(activeTool, axis, activeTool === 'rotate' ? 30 : 1)}>+</button>
                </div>
              ))}

            {activeTool === 'scale' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                  <button
                    onClick={() => {
                      setScaleLocked((prev) => {
                        const nowLocked = !prev;
                        if (nowLocked) syncScaleToSmallest();
                        return nowLocked;
                      });
                    }}
                    style={{
                      fontSize: '14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#333',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <i className={scaleLocked ? 'ri-lock-line' : 'ri-lock-unlock-line'}></i>
                    <span style={{ fontSize: '12px' }}>{scaleLocked ? 'Locked' : 'Unlocked'}</span>
                  </button>
                </div>

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
                      value={dummyValues.scale[axis].toFixed(2)}
                      readOnly
                      style={valueInputStyle}
                    />
                    <button style={stepperBtn} onClick={() => updateValue('scale', axis, -0.1)}>−</button>
                    <button style={stepperBtn} onClick={() => updateValue('scale', axis, 0.1)}>+</button>
                  </div>
                ))}
              </>
            )}

            {/* Reset Button */}
            <div style={{ marginTop: '8px' }}>
            <button
                onClick={() => resetValues(activeTool)}
                style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none',        // ✅ Removes blue border
                boxShadow: 'none',      // ✅ Removes shadow highlight
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

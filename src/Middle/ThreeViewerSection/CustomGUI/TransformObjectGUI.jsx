

// import { useState } from 'react';
// import { createPortal } from 'react-dom';
// import * as THREE from 'three';
// import 'remixicon/fonts/remixicon.css';

// export default function TransformObjectGUI({ selectedIds, objectTransforms, setObjectTransforms }) {
//   const selectedId = selectedIds[0];
//   const transform = selectedId ? objectTransforms[selectedId] : null;
//   const disabled = !selectedId;

//   const [activeTool, setActiveTool] = useState(null);
//   const [scaleLocked, setScaleLocked] = useState(true);

//   const TOOLBAR_LEFT_PX = 550;
//   const TOOLBAR_BOTTOM_PX = 20;
//   const PANEL_BOTTOM_PX = 75;

//   const axisIndex = (axis) => (axis === 'x' ? 0 : axis === 'y' ? 1 : 2);

//   const handleToolClick = (tool) => {
//     setActiveTool((prev) => (prev === tool ? null : tool));
//   };

//   const updateValue = (tool, axis, delta) => {
//     if (!selectedId) return;

//     setObjectTransforms((prev) => {
//       const current = prev[selectedId];
//       const i = axisIndex(axis);

//       const newPosition = [...current.position];
//       const newRotation = [...current.rotation];
//       const newScale = [...current.scale];

//       if (tool === 'translate') {
//         newPosition[i] += delta;
//       } else if (tool === 'rotate') {
//         newRotation[i] += THREE.MathUtils.degToRad(delta);
//       } else if (tool === 'scale') {
//         if (scaleLocked) {
//           const newValue = newScale[i] + delta;
//           newScale[0] = newValue;
//           newScale[1] = newValue;
//           newScale[2] = newValue;
//         } else {
//           newScale[i] += delta;
//         }
//       }

//       return {
//         ...prev,
//         [selectedId]: {
//           ...current,
//           position: newPosition,
//           rotation: newRotation,
//           scale: newScale,
//         },
//       };
//     });
//   };

//   const resetValues = (tool) => {
//     if (!selectedId) return;

//     const defaults = {
//       translate: [0, 0, 0],
//       rotate: [0, 0, 0],
//       scale: [1, 1, 1],
//     };

//     setObjectTransforms((prev) => ({
//       ...prev,
//       [selectedId]: {
//         ...prev[selectedId],
//         position: tool === 'translate' ? [...defaults.translate] : prev[selectedId].position,
//         rotation: tool === 'rotate' ? [...defaults.rotate] : prev[selectedId].rotation,
//         scale: tool === 'scale' ? [...defaults.scale] : prev[selectedId].scale,
//       },
//     }));
//   };

//   const syncScaleToSmallest = () => {
//     if (!selectedId) return;

//     const smallest = Math.min(...transform.scale);
//     setObjectTransforms((prev) => ({
//       ...prev,
//       [selectedId]: {
//         ...prev[selectedId],
//         scale: [smallest, smallest, smallest],
//       },
//     }));
//   };

//   const getDisplayValue = (tool, axis) => {
//     if (!transform) return '--';
//     const i = axisIndex(axis);
//     if (tool === 'translate') return `${transform.position[i].toFixed(2)} cm`;
//     if (tool === 'rotate') return `${THREE.MathUtils.radToDeg(transform.rotation[i]).toFixed(2)}°`;
//     if (tool === 'scale') return `${transform.scale[i].toFixed(2)}`;
//     return '--';
//   };

//   const axisColors = {
//     x: '#ff0000',
//     y: '#00aa00',
//     z: '#0000ff',
//   };

//   const buttons = [
//     { key: 'translate', iconClass: 'ri-drag-move-2-fill', label: 'Translate' },
//     { key: 'rotate', iconClass: 'ri-clockwise-2-line', label: 'Rotate' },
//     { key: 'scale', iconClass: 'ri-expand-diagonal-line', label: 'Scale' },
//   ];

//   const valueInputStyle = {
//     width: '80px',
//     padding: '2px 6px',
//     fontSize: '12px',
//     fontFamily: 'monospace',
//     border: '1px solid #bbb',
//     borderRadius: '4px',
//     backgroundColor: '#f3f3f3',
//     color: '#222',
//     outline: 'none',
//     boxShadow: 'none',
//     textAlign: 'right',
//   };

//   const stepperBtn = {
//     border: 'none',
//     background: '#ddd',
//     padding: '1px 0',
//     cursor: disabled ? 'not-allowed' : 'pointer',
//     fontWeight: 'bold',
//     fontSize: '13px',
//     borderRadius: '50%',
//     width: '24px',
//     height: '24px',
//     outline: 'none',
//     boxShadow: 'none',
//     opacity: disabled ? 0.5 : 1,
//   };

//   return (
//     <>
//       {/* Toolbar */}
//       <div
//         style={{
//           position: 'absolute',
//           left: `${TOOLBAR_LEFT_PX}px`,
//           bottom: `${TOOLBAR_BOTTOM_PX}px`,
//           transform: 'translateX(-50%)',
//           display: 'flex',
//           gap: '1px',
//           backgroundColor: 'rgba(202, 202, 214, 0.8)',
//           padding: '8px 12px',
//           borderRadius: '10px',
//           zIndex: 9999,
//         }}
//       >
//         {buttons.map((btn) => (
//           <button
//             key={btn.key}
//             title={btn.label}
//             onClick={() => handleToolClick(btn.key)}
//             style={{
//               background: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               padding: '5px 10px',
//               display: 'flex',
//               alignItems: 'center',
//               color: activeTool === btn.key ? '#000' : 'black',
//               outline: 'none',
//               boxShadow: 'none',
//               position: 'relative',
//               opacity: disabled ? 0.4 : 1,
//               pointerEvents: disabled ? 'none' : 'auto',
//             }}
//           >
//             <i className={btn.iconClass} style={{ fontSize: '20px' }}></i>
//             {activeTool === btn.key && !disabled && (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: -6,
//                   left: '50%',
//                   transform: 'translateX(-50%)',
//                   width: 0,
//                   height: 0,
//                   borderLeft: '5px solid transparent',
//                   borderRight: '5px solid transparent',
//                   borderBottom: '6px solid black',
//                 }}
//               />
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Floating Panel */}
//       {activeTool &&
//         createPortal(
//           <div
//             style={{
//               position: 'absolute',
//               left: `${TOOLBAR_LEFT_PX}px`,
//               bottom: `${PANEL_BOTTOM_PX}px`,
//               transform: 'translateX(-50%)',
//               backgroundColor: disabled ? 'rgba(200, 200, 200, 0.4)' : 'rgba(216, 217, 224, 0.92)',
//               padding: '10px 12px',
//               borderRadius: '10px',
//               boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
//               fontFamily: 'monospace',
//               fontSize: '13px',
//               zIndex: 9999,
//               width: '220px',
//               textAlign: 'center',
//               pointerEvents: disabled ? 'none' : 'auto',
//               opacity: disabled ? 0.5 : 1,
//             }}
//           >
//             <strong style={{ textTransform: 'capitalize', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
//               {activeTool} Controls
//             </strong>

//             {(activeTool === 'translate' || activeTool === 'rotate') &&
//               ['x', 'y', 'z'].map((axis) => (
//                 <div
//                   key={axis}
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     gap: '10px',
//                     marginBottom: '6px',
//                   }}
//                 >
//                   <span style={{ width: '12px', fontWeight: 600, color: axisColors[axis] }}>{axis}</span>
//                   <input
//                     type="text"
//                     value={getDisplayValue(activeTool, axis)}
//                     readOnly
//                     style={valueInputStyle}
//                   />
//                   <button style={stepperBtn} onClick={() => updateValue(activeTool, axis, activeTool === 'rotate' ? -30 : -1)} disabled={disabled}>−</button>
//                   <button style={stepperBtn} onClick={() => updateValue(activeTool, axis, activeTool === 'rotate' ? 30 : 1)} disabled={disabled}>+</button>
//                 </div>
//               ))}

//             {activeTool === 'scale' && (
//               <>
//                 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
//                   <button
//                     onClick={() => {
//                       if (disabled) return;
//                       setScaleLocked((prev) => {
//                         const nowLocked = !prev;
//                         if (nowLocked) syncScaleToSmallest();
//                         return nowLocked;
//                       });
//                     }}
//                     style={{
//                       fontSize: '14px',
//                       background: 'transparent',
//                       border: 'none',
//                       cursor: disabled ? 'not-allowed' : 'pointer',
//                       color: '#333',
//                       outline: 'none',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '4px',
//                       opacity: disabled ? 0.5 : 1,
//                     }}
//                     disabled={disabled}
//                   >
//                     <i className={scaleLocked ? 'ri-lock-line' : 'ri-lock-unlock-line'}></i>
//                     <span style={{ fontSize: '12px' }}>{scaleLocked ? 'Locked' : 'Unlocked'}</span>
//                   </button>
//                 </div>

//                 {['x', 'y', 'z'].map((axis) => (
//                   <div
//                     key={axis}
//                     style={{
//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       gap: '10px',
//                       marginBottom: '6px',
//                     }}
//                   >
//                     <span style={{ width: '12px', fontWeight: 600, color: axisColors[axis] }}>{axis}</span>
//                     <input
//                       type="text"
//                       value={getDisplayValue('scale', axis)}
//                       readOnly
//                       style={valueInputStyle}
//                     />
//                     <button style={stepperBtn} onClick={() => updateValue('scale', axis, -0.1)} disabled={disabled}>−</button>
//                     <button style={stepperBtn} onClick={() => updateValue('scale', axis, 0.1)} disabled={disabled}>+</button>
//                   </div>
//                 ))}
//               </>
//             )}

//             {/* Reset Button */}
//             <div style={{ marginTop: '8px' }}>
//               <button
//                 onClick={() => resetValues(activeTool)}
//                 disabled={disabled}
//                 style={{
//                   backgroundColor: '#444',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '4px 10px',
//                   fontSize: '12px',
//                   cursor: disabled ? 'not-allowed' : 'pointer',
//                   opacity: disabled ? 0.5 : 1,
//                   outline: 'none',
//                   boxShadow: 'none',
//                 }}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>,
//           document.body
//         )}
//     </>
//   );
// }


import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import 'remixicon/fonts/remixicon.css';

export default function TransformObjectGUI({ selectedIds, objectTransforms, setObjectTransforms }) {
  const selectedId = selectedIds[0];
  const transform = selectedId ? objectTransforms[selectedId] : null;
  const disabled = !selectedId;

  const [activeTool, setActiveTool] = useState(null);
  const [scaleLocked, setScaleLocked] = useState(true);
  const [panelVisible, setPanelVisible] = useState(false); // Controls full panel visibility

  // Update panel visibility based on selection
  useEffect(() => {
    if (selectedId) {
      setPanelVisible(true);  // Show panel
    } else {
      setPanelVisible(false); // Hide panel
      setActiveTool(null);    // Reset active tool
    }
  }, [selectedId]);

  const TOOLBAR_LEFT_PX = 550;
  const TOOLBAR_BOTTOM_PX = 20;
  const PANEL_BOTTOM_PX = 75;

  const axisIndex = (axis) => (axis === 'x' ? 0 : axis === 'y' ? 1 : 2);

  const handleToolClick = (tool) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const updateValue = (tool, axis, delta) => {
    if (!selectedId) return;

    setObjectTransforms((prev) => {
      const current = prev[selectedId];
      const i = axisIndex(axis);

      const newPosition = [...current.position];
      const newRotation = [...current.rotation];
      const newScale = [...current.scale];

      if (tool === 'translate') {
        newPosition[i] += delta;
      } else if (tool === 'rotate') {
        newRotation[i] += THREE.MathUtils.degToRad(delta);
      } else if (tool === 'scale') {
        if (scaleLocked) {
          const newValue = newScale[i] + delta;
          newScale[0] = newValue;
          newScale[1] = newValue;
          newScale[2] = newValue;
        } else {
          newScale[i] += delta;
        }
      }

      return {
        ...prev,
        [selectedId]: {
          ...current,
          position: newPosition,
          rotation: newRotation,
          scale: newScale,
        },
      };
    });
  };

  const resetValues = (tool) => {
    if (!selectedId) return;

    const defaults = {
      translate: [0, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    };

    setObjectTransforms((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        position: tool === 'translate' ? [...defaults.translate] : prev[selectedId].position,
        rotation: tool === 'rotate' ? [...defaults.rotate] : prev[selectedId].rotation,
        scale: tool === 'scale' ? [...defaults.scale] : prev[selectedId].scale,
      },
    }));
  };

  const syncScaleToSmallest = () => {
    if (!selectedId) return;

    const smallest = Math.min(...transform.scale);
    setObjectTransforms((prev) => ({
      ...prev,
      [selectedId]: {
        ...prev[selectedId],
        scale: [smallest, smallest, smallest],
      },
    }));
  };

  const getDisplayValue = (tool, axis) => {
    if (!transform) return '--';
    const i = axisIndex(axis);
    if (tool === 'translate') return `${transform.position[i].toFixed(2)} cm`;
    if (tool === 'rotate') return `${THREE.MathUtils.radToDeg(transform.rotation[i]).toFixed(2)}°`;
    if (tool === 'scale') return `${transform.scale[i].toFixed(2)}`;
    return '--';
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
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    outline: 'none',
    boxShadow: 'none',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <>
      {/* Toolbar */}
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
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              color: activeTool === btn.key ? '#000' : 'black',
              outline: 'none',
              boxShadow: 'none',
              position: 'relative',
              opacity: disabled ? 0.4 : 1,
              pointerEvents: disabled ? 'none' : 'auto',
            }}
          >
            <i className={btn.iconClass} style={{ fontSize: '20px' }}></i>
            {activeTool === btn.key && !disabled && (
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
      {panelVisible && activeTool &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              left: `${TOOLBAR_LEFT_PX}px`,
              bottom: `${PANEL_BOTTOM_PX}px`,
              transform: 'translateX(-50%)',
              backgroundColor: disabled ? 'rgba(200, 200, 200, 0.4)' : 'rgba(216, 217, 224, 0.92)',
              padding: '10px 12px',
              borderRadius: '10px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
              fontFamily: 'monospace',
              fontSize: '13px',
              zIndex: 9999,
              width: '220px',
              textAlign: 'center',
              pointerEvents: disabled ? 'none' : 'auto',
              opacity: disabled ? 0.5 : 1,
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
                    value={getDisplayValue(activeTool, axis)}
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
                      if (disabled) return;
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
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      color: '#333',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: disabled ? 0.5 : 1,
                    }}
                    disabled={disabled}
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
                      value={getDisplayValue('scale', axis)}
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
                disabled={disabled}
                style={{
                  backgroundColor: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                  outline: 'none',
                  boxShadow: 'none',
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

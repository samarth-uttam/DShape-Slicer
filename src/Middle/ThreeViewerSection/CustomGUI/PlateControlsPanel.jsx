import React, { useState } from 'react';
import { useSceneStore } from '../../../Store/sceneStore'

export default function PlateControlsPanel() {
    const plates = useSceneStore((state) => state.plates);
    const selectedPlateId = useSceneStore((state) => state.selectedPlateId);
    const setSelectedPlateId = useSceneStore((state) => state.setSelectedPlateId);
  
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div style={{
        position: 'absolute',
        top: 200,
        left: 20,
        zIndex: 9999,
        width: '240px',
        backgroundColor: '#ffffffee',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'monospace'
      }}>
        {/* Header with toggle arrow */}
        <div
          onClick={() => setIsOpen(!isOpen)}
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
          📦 Plate Manager
          <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            ▶
          </span>
        </div>
  
        {/* Collapsible content */}
        <div
          style={{
            maxHeight: isOpen ? '1000px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out',
          }}
        >
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {plates.map((plate) => (
              <button
                key={plate.id}
                onClick={() => setSelectedPlateId(plate.id)}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: selectedPlateId === plate.id ? '2px solid #000' : '1px solid #aaa',
                  backgroundColor: selectedPlateId === plate.id ? '#e6e6e6' : '#f7f7f7',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {plate.id}
              </button>
            ))}
  
            <button
              onClick={() => {
                const { plates, selectedPlateId } = useSceneStore.getState();
                const exportData = { plates, selectedPlateId };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sceneStoreExport.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #aaa',
                backgroundColor: '#f0e7e7',
                cursor: 'pointer',
                width: '100%',
                marginTop: '8px',
                userSelect: 'none',  // 👈 prevent blue highlight

              }}
            >
              📤 Export Scene
            </button>
          </div>
        </div>
      </div>
    );
  }
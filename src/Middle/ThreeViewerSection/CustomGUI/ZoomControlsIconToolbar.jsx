import 'remixicon/fonts/remixicon.css';

export default function ZoomControlsIconToolbar() {
  const buttons = [
    { iconClass: 'ri-box-3-fill'},
    { iconClass: 'ri-zoom-in-line'  },
    { iconClass: 'ri-zoom-out-line'  },
    
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 125,
        display: 'flex',
        flexDirection: 'row',
        gap: '1px',
        background: 'rgba(202, 202, 214, 0.8)',
        padding: '8px 12px',
        borderRadius: '10px',
        zIndex: 9999,
      }}
    >
      {buttons.map((btn, index) => (
        <button
          key={index}
          title={btn.label}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: 'black',
          }}
          onClick={() => alert(`${btn.label} clicked (no action yet)`)}
        >
          <i
            className={btn.iconClass}
            style={{
              fontSize: '20px',
              transition: 'color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#333')}
            onMouseLeave={(e) => (e.target.style.color = 'black')}
          ></i>
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
}

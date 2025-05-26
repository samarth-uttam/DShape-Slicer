import 'remixicon/fonts/remixicon.css';

export default function ZoomControlsIconToolbar({onHomeClick ,   HandleZoomOutClick, HandleZoomInClick}) {
  const buttons = [
    {
      iconClass: 'ri-home-fill',
      // label: 'Home View',

      
      onClick: () => {
        console.log('🟢 Home button clicked');
        if (onHomeClick) onHomeClick();  // call parent’s function
      },
      
    
    },
    {
      iconClass: 'ri-zoom-in-line',
      // label: 'Zoom In',
          
      onClick: () => {
        console.log('🟢 Zoom IN button clicked');
        if (HandleZoomOutClick) HandleZoomOutClick();  // call parent’s function
      },


    },
    {
      iconClass: 'ri-zoom-out-line',
      // label: 'Zoom Out',
          
      onClick: () => {
        console.log('🟢 Zoom Out button clicked');
        if (HandleZoomInClick) HandleZoomInClick();  // call parent’s function
      },


    },
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
        backgroundColor: 'rgba(202, 202, 214, 0.8)', // fixed key name
        padding: '8px 12px',
        borderRadius: '10px',
        zIndex: 9999,
        
      }}
    >
      {buttons.map((btn, index) => (
        <button
          key={index}
          title={btn.label}
          onClick={btn.onClick}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: 'black',
            outline: 'none', // 👈 Add this line
          }}
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

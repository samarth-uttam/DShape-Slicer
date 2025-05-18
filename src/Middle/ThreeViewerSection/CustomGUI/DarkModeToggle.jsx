import { useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import './DarkModeToggle.css';



export default function DarkModeToggle({onToggleClick}) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    console.log(`🌓 Theme is now ${newMode ? 'Dark' : 'Light'} Mode`);


       if (onToggleClick) {
      onToggleClick(newMode); // Optional: pass newMode if needed
    }
  };

  

  

  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        top: 125,
        zIndex: 9999,
      }}
    >
      <button
        onClick={toggleTheme}
         className="dark-toggle-btn"
         title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        style={{
          width: '60px',
          height: '28px',
          borderRadius: '16px',
          backgroundColor: isDark ? '#333' : '#ddd',
          border: '1px solid #aaa',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isDark ? 'flex-end' : 'flex-start',
          padding: '3px',
          transition: 'all 0.3s ease-in-out',
          outline: 'none', // 👈 Add this line
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#111' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: isDark ? '#f9d71c' : '#555',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <i className={isDark ? 'ri-moon-line' : 'ri-sun-line'} />
        </div>
      </button>
    </div>
  );
}

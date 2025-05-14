import { useState, useEffect, useRef } from 'react';
import { UserCircle, Settings2 } from 'lucide-react';
import '../Styles/Header.css';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconColor = (menuName) => (activeMenu === menuName ? '#e2e8f0' : 'white');

  return (
    <header className="top" ref={menuRef}>
      {/* Left: Logo + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <img src="/Dshape_1.webp" alt="Logo" style={{ height: '50px' }} />
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          {["Get Started", "Support", "Dev Notes", "Documentation"].map((label) => (
            <a
              key={label}
              href="#"
              className="nav-link"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Right: User (Settings) + Printer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {/* User Settings Icon */}
        <div
          className={`menu-icon ${activeMenu === 'user' ? 'active' : ''}`}
          onClick={() => setActiveMenu(activeMenu === 'user' ? null : 'user')}
        >
          <UserCircle color={iconColor('user')} size={20} />
        </div>

        {activeMenu === 'user' && (
          <div className="menu-popup">
            <div className="menu-item">Account Settings</div>
            <div className="menu-item">Logout</div>
          </div>
        )}

        {/* Printer Settings Icon */}
        <div
          className={`menu-icon ${activeMenu === 'printer' ? 'active' : ''}`}
          onClick={() => setActiveMenu(activeMenu === 'printer' ? null : 'printer')}
        >
          <Settings2 color={iconColor('printer')} size={20} />
        </div>

        {activeMenu === 'printer' && (
          <div className="menu-popup">
            <div className="menu-item">Units</div>
            <div className="menu-item">Material Overlap</div>
            <div className="menu-item">Print Speed</div>
          </div>
        )}
      </div>
    </header>
  );
}

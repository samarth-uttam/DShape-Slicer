import { useState, useEffect, useRef } from 'react';
import { UserCircle, Settings2 } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const userRef = useRef();
  const printerRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      const clickedOutsideUser = userRef.current && !userRef.current.contains(e.target);
      const clickedOutsidePrinter = printerRef.current && !printerRef.current.contains(e.target);

      if (clickedOutsideUser && clickedOutsidePrinter) {
        setActiveMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconColor = (menuName) => (activeMenu === menuName ? '#e2e8f0' : 'white');

  return (
    <header className="top">
      {/* Left: Logo + Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <a href="/">
<img
  // src="/Dshape_1.webp" // 👈 Use the correct path for your logo
  src={`${import.meta.env.BASE_URL}Dshape_1.webp`} alt="Logo"
  style={{ height: '50px', cursor: 'pointer' }}
  onClick={(e) => {
    e.preventDefault(); // Just in case
    const confirmed = window.confirm(
      'Are you sure you want to go to the homepage? This will reset the scene and any changes will be lost.'
    );
    if (confirmed) {
        window.location.href = import.meta.env.BASE_URL;

    }
  }}
/></a>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
         {[
  { label: "Get Started", url: "https://publish.obsidian.md/d-shape/D-Shape/About" },
  
  { label: "Dev Notes - Releases", url: "#" },
  { label: "Support", url: "#" }
].map(({ label, url }) => (
  <a
    key={label}
    href={url}
    target={url.startsWith('http') ? '_blank' : '_self'}
    rel="noopener noreferrer"
    className="nav-link"
  >
    {label}
  </a>
))}
        </nav>
      </div>

      {/* Right: Settings + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {/* Printer Settings Icon */}
        <div ref={printerRef}>
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

        {/* User Settings Icon */}
        <div ref={userRef}>
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
        </div>
      </div>
    </header>
  );
}

// src/App.jsx
import './Styles/index.css';
import './Styles/main.css';

import HeaderSection from './Header/HeaderSection';
import MiddleSection from './Middle/MiddleSection';
import FooterSection from './sections/FooterSection';



function App() {
  return (
    <div className="container">
      <HeaderSection />
      <MiddleSection />
      {/* <FooterSection /> */}
    </div>
  );
}

export default App;

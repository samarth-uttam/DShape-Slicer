// src/App.jsx
import './main.css';

import HeaderSection from './sections/HeaderSection';
import MiddleSection from './sections/MiddleSection';
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

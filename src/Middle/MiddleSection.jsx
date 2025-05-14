// src/sections/MiddleSection.jsx
import ThreeViewer from '../Middle/ThreeViewerSection/ThreeViewer';

function MiddleSection() {
  return (
    <div className="middle">
      <div className="viewer">
        <ThreeViewer />
      </div>
      {/* <div className="settings">
        This is the Settings Panel version 3 on my main mac  
      </div> */}
    </div>
  );
}

export default MiddleSection;

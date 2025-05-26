
// clearing the console for debugging purposes. Chrome does not clear the console when you refresh the page.
// this is a workaround to clear the console when the page is refreshed.
console.clear()


//importing standard libraries 

import { Canvas, useThree ,useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useRef, useState , useMemo } from 'react';
import { Stats, Grid, Center, GizmoHelper, GizmoViewport, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, useGLTF  } from '@react-three/drei';
import { TransformControls } from '@react-three/drei';
import { Eye, EyeOff } from 'lucide-react'
import { Leva } from 'leva'
import { Edges } from '@react-three/drei';
import { toast, ToastContainer , Bounce , Slide} from 'react-toastify';
import React from 'react';




//importing different .jsx files from the same project 
import ClickCheck from './scene/ClickCheck'
import ZoomControlsIconToolbar from './CustomGUI/ZoomControlsIconToolbar'
import ObjectManuplationGUI from './CustomGUI/ObjectManuplationGUI'
import DarkModeToggle from './CustomGUI/DarkModeToggle'
import * as initConfig from '../../config/InitConfig';
import TransformObjectGUI from './CustomGUI/TransformObjectGUI';


// import temp_01 from '../../tempFunctions/temp_01.jsx';


import 'react-toastify/dist/ReactToastify.css';
import '../../styles/toast.css';


// ✅ This is correct
import { TOAST_CONTAINER_STYLE } from '../../config/InitConfig';
import { TOAST_OPTIONS , showToast , BASE_OPTIONS , } from '../../config/ToastConfig';
import { TOAST_COLORS } from '../../config/InitConfig';



const time = new Date().toLocaleTimeString();

//---------------------------------------------------------------------- PRINTABLE AREA OBJECTS --------------------------------------------------------------- : 

function BasePlateWithGridCombined({
  // color = '#000', // dark base plate
  color = 'rgba(202, 202, 214)',
  x_width = 20,
  y_width = 40,
  thickness = 1,
  gridSegments = 20,
  box_height = 10
}) {
  const stepX = x_width / gridSegments;
  const stepY = y_width / gridSegments;

  const lines = [];

  // Generate vertical grid lines
  for (let i = 0; i <= gridSegments; i++) {
    const x = i * stepX;
    lines.push(
      <line key={`v-${i}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              x, 0, 0,
              x, y_width, 0
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#888" linewidth={1} />
      </line>
    );
  }

  // Generate horizontal grid lines
  for (let j = 0; j <= gridSegments; j++) {
    const y = j * stepY;
    lines.push(
      <line key={`h-${j}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              0, y, 0,
              x_width, y, 0
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#888" linewidth={1} />
      </line>
    );
  }

  // Thicker center lines
  const centerLines = [
    <line key="center-v">
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([
            x_width / 2, 0, 0,
            x_width / 2, y_width, 0
          ])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="black" linewidth={3} />
    </line>,
    <line key="center-h">
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([
            0, y_width / 2, 0,
            x_width, y_width / 2, 0
          ])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="black" linewidth={3} />
    </line>
  ];

  // Triangle shape for arrow
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(0, 0);
  triangleShape.lineTo(1, 0.5);
  triangleShape.lineTo(1, -0.5);
  triangleShape.lineTo(0, 0);

  return (
    <group>
      {/* Base Plate */}
      <mesh position={[x_width / 2, y_width / 2, (-thickness / 2) - 0.01]}>
        <boxGeometry args={[x_width, y_width, thickness]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.25}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
        <Edges scale={1} threshold={15} color="#DDE6ED" />
      </mesh>

      {/* Grid */}
      <group position={[0, 0, 0]}>
        <mesh position={[x_width / 2, y_width / 2, 0]}>
          <planeGeometry args={[x_width, y_width]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} />
        </mesh>
        {lines}
        {centerLines}
      </group>

      {/* Border-only Cube on top */}
      <mesh position={[x_width / 2, y_width / 2, box_height / 2]}>
        <boxGeometry args={[x_width, y_width, box_height]} />
        <meshBasicMaterial color="white" transparent opacity={0} />
        <Edges scale={1} threshold={15} color="#DDE6ED" />
      </mesh>

      {/* Triangle Arrow at Right Edge */}
      <mesh
        position={[x_width/ 2, y_width , 0.01]} // Shifted to the right edge
        rotation={[0, 0, -Math.PI / 2]} // Flat and pointing in +X direction
      >
        <shapeGeometry args={[triangleShape]} />
        <meshStandardMaterial color="#DDE6ED" />
      </mesh>
    </group>
  );
}

// This is the colored axis on the build plate itself 


function ThickAxes({ x_length = 5 , y_length  = 5 , z_length = 5, radius = 0.05 }) {
  return (
    <group>
      {/* X-axis: red */}
      <mesh position={[x_length / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, x_length, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* Y-axis: green */}
      <mesh position={[0, y_length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, y_length, 16]} />
        <meshBasicMaterial color="green" />
      </mesh>

      {/* Z-axis: blue */}
      <mesh position={[0, 0, z_length / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, z_length, 16]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
}


// Rendering the Original Isocahedron


function OriginalCube({
  color = 'skyblue',
  position = [1, 1, 1],
  rotation = [0, 0, 0],
  edgeColor = 'black'
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
      <Edges
        scale={1}         // Slightly outside the box
        threshold={15}       // Lower = more edge detail
        color={edgeColor}    // Outline color
      />
    </mesh>
  );
}

// Rendering the Icosahedron
function Icosahedron({ color = 'hotpink',position , rotation}) {
  return (
    <mesh position={[position]} rotation={rotation}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}


//rendering the second box to the scene 

function SecondBox({ color = 'blue', position , rotation}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}



// Rendering the TorusKnot to the scene
function TorusKnot({ color = 'green', position , rotation}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusKnotGeometry args={[1, 0.4, 100, 16]} />
      <meshStandardMaterial color={color} wireframe={false}/>
    </mesh>
  );
}


// Setting the camera to Z-up

function SetZUpCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.up.set(0, 0, 1)   // 👈 Z-up
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}




// AxesHelper Component
function AxisHelper({ size = 100 }) {
  const { scene } = useThree();
  const axesRef = useRef();

  useEffect(() => {
    const axes = new THREE.AxesHelper(size);
    scene.add(axes);
    axesRef.current = axes;

    return () => {
      scene.remove(axes);
    };
  }, [scene, size]);

  return null;
}





// making the canvas 

function SceneCanvas({ children , onPointerMissed}) {
  return (
    <Canvas

    
      style={{ width: '100%', height: '100%' }}
      
      camera={{ 
        position: initConfig.HOME_CAMERA_POSITION,
        fov: initConfig.HOME_CAMERA_FOV,
        near: initConfig.HOME_CAMERA_NEAR, 
        far: initConfig.HOME_CAMERA_FAR }}


      onPointerMissed={onPointerMissed}
      >
        
      {children}
    </Canvas>
  );
}

function CameraControls({
  enableDamping = false,
  dampingFactor = 0.1,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  cameraRef, // ✅ Receive this from parent
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  // Pass the OrbitControls instance to the parent
  useEffect(() => {
    if (cameraRef) {
      cameraRef.current = controlsRef.current;
    }
  }, [cameraRef]);

  // Add keyboard pan behavior
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleKeyDown = (e) => {
      const step = 0.5;
      switch (e.key) {
        case 'ArrowUp':
          controls.target.x += step;
          camera.position.x += step;
          break;
        case 'ArrowDown':
          controls.target.x -= step;
          camera.position.x -= step;
          break;
        case 'ArrowLeft':
          controls.target.y += step;
          camera.position.y += step;
          break;
        case 'ArrowRight':
          controls.target.y -= step;
          camera.position.y -= step;
          break;
        default:
          return;
      }
      controls.update();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera]);

  return (
    <OrbitControls
      makeDefault
      ref={controlsRef}
      args={[camera, gl.domElement]}
      target={[2, 12, -8]}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      enablePan={enablePan}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      panSpeed={0.5}
      zoomSpeed={0.2}

    />
  );
}



// At the top of your file, after imports
// import { useRef } from 'react';

export const cameraRef = { current: null }; // ✅ not a hook, just a JS object



export function handleHomeClick(onFirstToast) {

  if (cameraRef.current) {
    cameraRef.current.object.position.set(...initConfig.HOME_CAMERA_POSITION);
    cameraRef.current.target.set(...initConfig.HOME_CAMERA_TARGET);
    cameraRef.current.update();

    showToast('Home Position Set Successfully!', onFirstToast);
  }
}

export function HandleZoomInClick(onFirstToast) {
  if (cameraRef.current) {
    cameraRef.current.dollyIn(1.1);  // Smaller value = slower zoom
    cameraRef.current.update();      // Must call this

      showToast('Zoomed in Successfully!', onFirstToast);
  }
}

export function HandleZoomOutClick(onFirstToast) {
  if (cameraRef.current) {
    cameraRef.current.dollyOut(1.1); // Smaller value = slower zoom
    cameraRef.current.update();

          showToast('Zoomed Out Successfully!', onFirstToast);

  }
}


// At the top or in a separate utils.js file
export function HandleDarkToggleClick(setSceneColor, isDarkMode, onFirstToast = () => {}) {
  console.log('🔄 [handleDarkToggleClick] Now executing...');

  if (isDarkMode) {
    setSceneColor(initConfig.DARK_SCENE_COLOR);  // Dark background
  } else {
    setSceneColor(initConfig.INITIAL_SCENE_COLOR);  // Light/default background
  }

  console.log(`✅ Scene color set to ${isDarkMode ? 'dark' : 'light'} mode`);
  showToast(`Scene color set to ${isDarkMode ? 'dark' : 'light'} mode`, onFirstToast);
}



const WelcomeToast = React.forwardRef((_, ref) => (
  <div
    ref={ref}
    style={{
      position: 'fixed',
      top: 115,
      left: 15,
      backgroundColor: TOAST_COLORS.background,
      color: TOAST_COLORS.text.success,
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '15px',
      padding: '2px 8px',
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '50px',
      borderBottomRightRadius: '50px',
      borderBottomLeftRadius: '0px',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.01)',
      zIndex: 9999,
    }}
  >
   ⚙️ Welcome to D-Shape Slicer. Please add an object to get started. For Tutorial Click on 'Get Started' above.
  </div>
));


// a function to see teh camera position and target in the console

function CameraLogger() {
  useFrame(() => {
    if (cameraRef.current) {
      const pos = cameraRef.current.object.position;
      const target = cameraRef.current.target;

      console.log('🎯 Camera Position:');
      console.log(`x: ${pos.x.toFixed(2)}\ny: ${pos.y.toFixed(2)}\nz: ${pos.z.toFixed(2)}`);

      console.log('🔽 Camera Target:');
      console.log(`x: ${target.x.toFixed(2)}\ny: ${target.y.toFixed(2)}\nz: ${target.z.toFixed(2)}`);
    }
  });

  return null;
}


// This is the main threeviewer Function 


function ThreeViewer() {


      const [sceneColor, setSceneColor] = useState(initConfig.INITIAL_SCENE_COLOR);
      const [showWelcome, setShowWelcome] = useState(true);
      const welcomeRef = useRef();
      const handleRealToast = () => setShowWelcome(false);

      const removeWelcomeToast = () => 
        {
          if (welcomeRef.current) {
          welcomeRef.current.remove();
          }
        };


    return (

      <>
      {/* <Leva titleBar={{ title: 'Controls', drag: true }} collapsed={true} /> */}

      <SceneCanvas>
      <color attach="background" args={[sceneColor]} />

      <ambientLight intensity={0.5} />
      <CameraControls cameraRef={cameraRef} /> {/* ✅ ref passed */}


      <SetZUpCamera />
      <directionalLight position={[2, 2, 2]} />
      <BasePlateWithGridCombined 
          x_width={initConfig.INITIAL_BUILD_PLATE_x}
          y_width={initConfig.INITIAL_BUILD_PLATE_y }
          thickness={0.5} 
          gridSegments={20} 
          box_height={initConfig.INITIAL_BUILD_PLATE_z} />

      <ThickAxes x_length={20} y_length={40} z_length={10} radius={0.02} />
      {/* <CameraLogger /> */}



      <OriginalCube color="skyblue" />

      <GizmoHelper alignment="bottom-left" margin={[50, 50]}>
      <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" hideNegativeAxes={true} />
      </GizmoHelper> 


      </SceneCanvas>
     

      {/* This is the dark mode toggle. it takes the dark mode status from the parent file */}

      <DarkModeToggle 
      onToggleClick=
      
      {(isDarkMode) => HandleDarkToggleClick( 
        setSceneColor, 
        isDarkMode, 
        () => {
                if (welcomeRef.current)
               {
                welcomeRef.current.remove();
                }
              })
      }
      />



      {/* <ZoomControlsIconToolbar onHomeClick={() => handleHomeClick(removeWelcomeToast) 
        
      } /> */}

<ZoomControlsIconToolbar
  onHomeClick={() => handleHomeClick(removeWelcomeToast)}
  HandleZoomInClick={() =>HandleZoomInClick(removeWelcomeToast)}
  HandleZoomOutClick={() =>HandleZoomOutClick(removeWelcomeToast)}
/>

        
      <ObjectManuplationGUI />
      <TransformObjectGUI/>


      {showWelcome && <WelcomeToast ref={welcomeRef} />}

      {/* <ToastContainer {...TOAST_OPTIONS} /> */}
      <ToastContainer {...TOAST_OPTIONS} style={TOAST_CONTAINER_STYLE} />

      </>
      );
      }


export default ThreeViewer;

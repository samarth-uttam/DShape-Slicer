
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



//importing different .jsx files from the same project 
import ClickCheck from './scene/ClickCheck'

//---------------------------------------------------------------------- PRINTABLE AREA OBJECTS --------------------------------------------------------------- : 


function BasePlateWithGridCombined({
  color = '#000', // dark base plate
  x_width = 20,
  y_width = 40,
  thickness = 1,
  gridSegments = 20
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

  return (
    <group>
      {/* Base Plate */}
      <mesh position={[x_width / 2, y_width / 2, (-thickness / 2) - 0.01]}>
        <boxGeometry args={[x_width, y_width, thickness]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
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
      <mesh position={[x_width / 2, y_width / 2, 5]}>
        <boxGeometry args={[x_width, y_width, 10]} />
        <meshBasicMaterial color="white" transparent opacity={0} />
        <Edges scale={1} threshold={15} color="#DDE6ED" />
       


      </mesh>
    </group>
  );
}




function ThickAxes({ length = 5, radius = 0.05 }) {
  return (
    <group>
      {/* X-axis: red */}
      <mesh position={[length / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* Y-axis: green */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshBasicMaterial color="green" />
      </mesh>

      {/* Z-axis: blue */}
      <mesh position={[0, 0, length / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
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




// control panel for the models in the scene

function ModelTogglePanel({ models, toggleVisibility, selectModel }) {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: 10,
      transform: 'translateY(-50%)',
      background: 'rgba(30, 30, 30, 0.9)',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      padding: '12px',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 10,
      maxHeight: '80vh',
      overflowY: 'auto',
      width: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>List of Objects</div>
      {models.map(model => (
        <div key={model.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span
            onClick={() => toggleVisibility(model.id)}
            style={{
              cursor: 'pointer',
              marginRight: '10px',
              color: model.visible ? 'orange' : 'gray'
            }}
          >
            {model.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </span>
          <span
            onClick={() => selectModel(model.id)}
            style={{
              cursor: 'pointer',
              fontWeight: model.selected ? 'bold' : 'normal',
              textDecoration: model.selected ? 'underline' : 'none'
            }}
          >
            {model.name}
          </span>
        </div>
      ))}
    </div>
  );
}





// making the canvas 

function SceneCanvas({ children , onPointerMissed}) {
  return (
    <Canvas

    
      style={{ width: '100%', height: '100%' }}
      
      camera={{ position: [43, 48, 27],
        fov: 50,
        near: 0.1, 
        far: 1000 }}


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
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleKeyDown = (e) => {
      const step = 0.5; // Smaller step = slower pan
      switch (e.key) {
        case 'ArrowUp':
          controls.target.x -= step;
          camera.position.x -= step;
          break;
        case 'ArrowDown':
          controls.target.x += step;
          camera.position.x += step;
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
          break;
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
 target={[2, 12, -8]}
  minPolarAngle={0}
  maxPolarAngle={Math.PI / 2}
  minAzimuthAngle={-Infinity}
  maxAzimuthAngle={Infinity}
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
  enableDamping={false}     // 🔧 disables smoothing
  panSpeed={0.5}            // ✅ optional: control pan speed
  zoomSpeed={0.2}           // ✅ optional: control zoom speed
/>
  );
}


// adding the grid to the scene 

function XYGrid() {
  return (
    <Grid
      position={[0, 0, 0]}       // center of the scene
      args={[200, 200]}            // width and height of the grid
      cellSize={1}
      cellThickness={0.5}
      cellColor="gray"
      sectionColor="black"
      fadeDistance={50}
      fadeStrength={0}
   rotation={[ -Math.PI / 2,0, 0]}
    />
  )
}


function getSceneObjects() {
  return [
    { id: 'ico-1',
      name: 'Icosahedron',
      Component: Icosahedron ,
      defaults: { position: [5, 1, 1], rotation: [0, 0, 0]}
    },

    { id: 'box-1',
      name: 'SecondBox',
      Component: SecondBox,
      defaults: { position: [10, 3, 3], rotation: [0, 0, 0] }},


    { id: 'tor-1',
      name: 'TorusKnot',
      Component: TorusKnot,
      defaults: { position: [0, 0, 0], rotation: [0, 0, 0]}}
    
    ]
}

function handlePointerMissedFactory(setSelected) {
  return (e) => {
    if (e.button === 0) {
      setSelected(null);
    }
  };
}









function CameraDebugger() {
  const { camera, controls } = useThree();

  useFrame(() => {
    console.log('📸 Camera position:', camera.position.toArray());
    if (controls) {
      console.log('🎯 Controls target:', controls.target.toArray());
    }
  });

  return null;
}




function ThreeViewer() {
  return (
    <>
      <Leva titleBar={{ title: 'Controls', drag: true }} collapsed={true} />

      <SceneCanvas>

        
          <color attach="background" args={['#eeeeee']} />
          <ambientLight intensity={0.5} />
          <CameraControls />
     

          <SetZUpCamera />
          <directionalLight position={[2, 2, 2]} />
          {/* <Stats /> */}
          {/* <AxisHelper/> */}
          <BasePlateWithGridCombined x_width={20} y_width={40} thickness={0.5} gridSegments={20} />
          {/* <OutwardTriangle /> */}

        
    

        
          

  


          <OriginalCube color="skyblue" />

          {/* <CameraDebugger />   */}

          {/* <ClickCheck objects={objects} /> */}


      </SceneCanvas>
    </>
  );
}


export default ThreeViewer;

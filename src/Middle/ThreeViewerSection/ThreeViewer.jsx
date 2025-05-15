
// clearing the console for debugging purposes. Chrome does not clear the console when you refresh the page.
// this is a workaround to clear the console when the page is refreshed.
console.clear()




//importing standard libraries 

import { Canvas, useThree ,useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useRef, useState , useMemo } from 'react';
import { Stats, Grid, Center, GizmoHelper, GizmoViewport, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, useGLTF, Edges , TransformControls, PerspectiveCamera} from '@react-three/drei';
import { Eye, EyeOff } from 'lucide-react'
import { Leva } from 'leva'





//importing different .jsx files from the same project 
import ClickCheck from './scene/ClickCheck'

//---------------------------------------------------------------------- PRINTABLE AREA OBJECTS --------------------------------------------------------------- : 

function FixedBoundingBox({ color = 'gray' }) {
  return (
    <mesh position={[1, 2, 0.5]} /* center of 2x2x6 box */>
      <boxGeometry args={[2, 4, 1]} />
      <meshStandardMaterial color={color} transparent opacity={0.2} />
      <Edges scale={1} threshold={15} color="black" />
    </mesh>
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


// Debugging the camera and controls

function CameraDebugger() {
  const { camera, controls } = useThree()

  useFrame(() => {
    console.log('Camera position:', camera.position)
    if (controls) {
      console.log('Controls target:', controls.target)
    }
  })

  return null
}


// making the canvas 

function SceneCanvas({ children , onPointerMissed}) {
  return (
    <Canvas

    
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 15, 10], fov: 50, near: 0.1, far: 1000 }}

      onPointerMissed={onPointerMissed}
      >
        
      {children}
    </Canvas>
  );
}


function CameraControls({
  enableDamping = true,
  dampingFactor = 0.1,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  }, []);

  return (
    <OrbitControls
      makeDefault // ✅ This line is critical!
      ref={controlsRef}
      args={[camera, gl.domElement]}
      target={[0, 0, 0]}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      screenSpacePanning={false}
       zoomSpeed={0.5} 
    />
  );
}



function LiveCameraLine() {
  const { camera, controls } = useThree();

  return (
    <DebugLine from={[camera.position.x, camera.position.y, camera.position.z]} to={controls?.target?.toArray?.() || [0, 0, 0]} color="lime" />
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
      fadeStrength={2}
   rotation={[0, -Math.PI / 2, 0]}
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






function ThreeViewer() {


  return (
    <>
 <Leva titleBar={{ title: 'Controls', drag: true }} collapsed={true} />


{/* <ModelTogglePanel
  models={models}
  toggleVisibility={toggleVisibility}
  selectModel={selectModel}
/> */}


  


<SceneCanvas>


      <ambientLight intensity={0.5} />
      {/* <CameraControls /> */}
      <directionalLight position={[2, 2, 2]} />
      {/* <XYGrid /> */}
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
      {/* Add Orbit Controls */}
      <OrbitControls/>


  
      <AxisHelper size={500} /> 

      <OriginalCube color="skyblue" />
      <ThickAxes length={10} radius={0.1} />

      <FixedBoundingBox color="gray" />
      <CameraDebugger />




      {/* // debugging the functions values */}
      {/* <Stats/> */}
      {/* <DebugCameraLive/> */}
      {/* <ClickCheck objects={objects} />*/}


    </SceneCanvas>

    </>
  );
  
}

export default ThreeViewer;

// src/components/ThreeViewer.jsx


// clearing the console

console.clear()



//importing standard libraries 

import { Canvas, useThree ,useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Stats, Grid, Center, GizmoHelper, GizmoViewport, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { TransformControls } from '@react-three/drei';
import { Eye, EyeOff, Layers3, ScanEye } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Leva } from 'leva'




// the test control to see the values in the console and see if leva works or not

import { useControls } from 'leva'
function TestControl() {
  const { test } = useControls('Debug', {
    test: { value: 5, min: 0, max: 10, step: 1 }
  })
  console.log('Test value:', test)
  return null
}



//importing different .jsx files from the same project 
import ClickCheck from './scene/ClickCheck'


// Rendering the Icosahedron
function Icosahedron({ color = 'hotpink',position , rotation}) {
  return (
   
      <icosahedronGeometry args={[1, 2]} />
      
  )
}


//rendering the second box to the scene 

function SecondBox({ color = 'blue', position , rotation}) {
  return (
    
      <boxGeometry args={[2, 2, 2]} />
      
   
  )
}



// Rendering the TorusKnot to the scene
function TorusKnot({ color = 'green', position , rotation}) {
  return (
    
      <torusKnotGeometry args={[1, 0.4, 100, 16]} />
      
  
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


// making the canvas 

function SceneCanvas({ children , onPointerMissed}) {
  return (
    <Canvas

    

      style={{ width: '100%', height: '100%' }}
      camera={{ position: [10, 10, 15], fov: 50, near: 0.1, far: 1000 }}
      onPointerMissed={onPointerMissed}
      >
        
      {children}
    </Canvas>
  );
}



// function to see the camera movement logs in initial setup 

function DebugCameraValues() {
  const { camera } = useThree()

  useEffect(() => {
    console.log('Camera Position:', camera.position.toArray())
    console.log('Camera FOV:', camera.fov)
    console.log('Camera Near:', camera.near)
    console.log('Camera Far:', camera.far)
  }, [camera])

  return null
}

// check if the camera has moved and display the values if changed 

function DebugCameraLive() {
  const { camera } = useThree()
  const lastPos = useRef([0, 0, 0])

  useFrame(() => {
    const pos = camera.position.toArray()
    const hasChanged = pos.some((val, i) => val !== lastPos.current[i])

    if (hasChanged) {
      console.log("Camera Position:", pos)
      console.log("FOV:", camera.fov)
      console.log("Near:", camera.near)
      console.log("Far:", camera.far)
      lastPos.current = pos
    }
  })

  return null
}


// orbit camera controller customisation 

function CameraControls({
  enableDamping = true,
  dampingFactor = 0.1,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  ...props
}) {
  return (
    <OrbitControls
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      {...props}
    />
  )
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
      // rotation={[Math.PI / 2, 0, 0]}  // ⬅ Rotate to XY plane
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

const [selected, setSelected] = useState(null)
const [hovered, setHovered] = useState(null)
const [selectedObjectId, setSelectedObjectId] = useState(null)
const [highlightColor, setHighlightColor] = useState('#ffa500') // Orange
const [wireframeColor, setWireframeColor] = useState('#00ffff') // Cyan
const [mode, setMode] = useState('translate')
const objects = getSceneObjects()
const [collapsed, setCollapsed] = useState(false) // <-- inside ThreeViewer
const panelWidth = collapsed ? 40 : 210


 const [models, setModels] = useState(() =>
  getSceneObjects().map(obj => ({
    ...obj,                    // includes id, name, Component, defaults
    visible: true,
    selected: false,
    renderMode: 'solid'
  }))
)

function setAllVisibility(state) {
  setModels(models => models.map(m => ({ ...m, visible: state })))
}


function toggleVisibility(id) {
  setModels(models => models.map(m =>
    m.id === id ? { ...m, visible: !m.visible } : m
  ))
}



function cycleRenderMode(id) {
  setModels(models =>
    models.map(m => {
      if (m.id !== id) return m
      const next =
        m.renderMode === 'solid' ? 'wireframe' :
        m.renderMode === 'wireframe' ? 'hidden' : 'solid'
      return { ...m, renderMode: next }
    })
  )
}

function toggleVisibility(id) {
  setModels(models => models.map(m =>
    m.id === id ? { ...m, visible: !m.visible } : m
  ))
}

function selectModel(id) {
  setModels(models =>
    models.map(m => ({
      ...m,
      selected: m.id === id ? !m.selected : false
    }))
  )

  setSelectedObjectId(prev => (prev === id ? null : id))
}


  const handlePointerMissed = handlePointerMissedFactory(setSelected);

  return (
    <>
    <Leva titleBar={{ title: 'Positional Controls', drag: true }} collapsed={true} />


<div style={{
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%)',
  background: 'rgba(30, 30, 30, 0.9)',
  borderRight: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  padding: collapsed ? '6px' : '12px',
  borderRadius: '0 10px 10px 0',
  color: 'white',
  fontFamily: 'monospace',
  fontSize: '14px',
  zIndex: 10,
  maxHeight: '80vh',
  overflowY: 'auto',
  width: `${panelWidth}px`,
  transition: 'width 0.3s ease'
}}>

  {/* Collapse Button */}
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
    <button onClick={() => setCollapsed(!collapsed)} style={{
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer'
    }}>
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  </div>

  {!collapsed && (
    <>
      <div style={{
        fontWeight: 'bold',
        fontSize: '13px',
        marginBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '4px'
      }}>
        List of Objects
      </div>

      {/* 🔁 Model list */}
      {models.map(model => (
        <div key={model.id} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span onClick={() => cycleRenderMode(model.id)} style={{
              cursor: 'pointer',
              marginRight: '10px',
              color:
                model.renderMode === 'solid' ? 'white' :
                model.renderMode === 'wireframe' ? 'deepskyblue' : 'gray'
            }}>
              {model.renderMode === 'solid' && <Layers3 size={16} />}
              {model.renderMode === 'wireframe' && <ScanEye size={16} />}
              {model.renderMode === 'hidden' && <EyeOff size={16} />}
            </span>

            <span
              onClick={() => selectModel(model.id)}
              style={{
                cursor: 'pointer',
                fontWeight: model.selected ? 'bold' : 'normal',
                textDecoration: model.selected ? 'underline' : 'none',
                userSelect: 'none'
              }}
            >
              {model.name}
            </span>
          </div>
        </div>
      ))}

      {/* 🎨 Color pickers in-line */}
      <div style={{
        fontSize: '12px',
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label style={{ marginRight: '4px' }}>Highlight</label>
        <input
          type="color"
          value={highlightColor}
          onChange={(e) => setHighlightColor(e.target.value)}
          style={{
            width: '20px',
            height: '20px',
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        />
      </div>

      <div style={{
        fontSize: '12px',
        marginTop: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <label style={{ marginRight: '4px' }}>Transparent</label>
        <input
          type="color"
          value={wireframeColor}
          onChange={(e) => setWireframeColor(e.target.value)}
          style={{
            width: '20px',
            height: '20px',
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* ✅ Show/Hide buttons at bottom */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px',
        gap: '6px'
      }}>
        <button
          onClick={() => setAllVisibility(true)}
          title="Show All"
          style={{
            flex: 1,
            padding: '4px',
            fontSize: '12px',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show
        </button>
        <button
          onClick={() => setAllVisibility(false)}
          title="Hide All"
          style={{
            flex: 1,
            padding: '4px',
            fontSize: '12px',
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Hide
        </button>
      </div>
    </>
  )}
</div>


    {/* <TestControl /> */}
    <SceneCanvas onPointerMissed={handlePointerMissed}>
      {/* <Canvas style={{ width: '100%', height: '100%' }}> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <XYGrid />
      
      {/* <DebugCameraLive/> */}
      {/* <ClickCheck objects={objects} />
       */}

<ClickCheck
  models={models} // ✅ simpler and reactive
  setSelectedId={setSelectedObjectId}
  hovered={hovered}
  setHovered={setHovered}
  mode={mode}
  highlightColor={highlightColor}
  wireframeColor={wireframeColor}
  selectedId={selectedObjectId}
/>




      <AxisHelper size={500} /> {/* Global axis here */}
      <CameraControls enableDamping={false} enablePan={true} />
      {/* <Stats/> */}
    </SceneCanvas>

    </>
  );
  
 

}

export default ThreeViewer;

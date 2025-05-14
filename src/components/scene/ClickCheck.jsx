import { useState } from 'react'
import InteractiveWrapper from './InteractiveWrapper'
import useDynamicControls from '../Hooks/useDynamicControls'

import * as THREE from 'three'

export default function ClickCheck({
  models,
  setSelectedId,
  selectedId,
  hovered,
  setHovered,
  mode,
  highlightColor,
  wireframeColor
}) {

  return (
    <>


      {models.map(({ id, name, Component, defaults, visible, selected, renderMode }) => {
  const isHovered = hovered === id
const { position, rotation } = useDynamicControls(id, defaults, selectedId, mode)
  console.log(`[DEBUG] ${name} - selected: ${selected}, renderMode: ${renderMode}`)

  return (
   <InteractiveWrapper
  key={id}
  id={id}
  name={name}
  selected={selected}
  hovered={hovered === id}
  onClick={() => setSelectedId(id)}
  onPointerOver={() => setHovered(id)}
  onPointerOut={() => setHovered(null)}
>
  <mesh
    visible={visible && renderMode !== 'hidden'}
    scale={selected ? 1.3 : 1}
    position={position}
    rotation={rotation}
  >
    <Component />
    <meshStandardMaterial
  color={
    renderMode === 'wireframe'
      ? wireframeColor
      : selected
      ? highlightColor
      : '#cccccc' // ✅ default gray color
  }
  wireframe={renderMode === 'wireframe'}
  transparent={renderMode === 'wireframe'}
  opacity={renderMode === 'wireframe' ? 0.3 : 1}
  roughness={0.4}          // ✅ better shading and edges
  metalness={0.2}          // ✅ slight reflectivity
  depthWrite={renderMode !== 'wireframe'}
  side={THREE.DoubleSide}
/>
  </mesh>
</InteractiveWrapper>

  )
})}
    </>
  )
}
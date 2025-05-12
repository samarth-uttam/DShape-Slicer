import { useState } from 'react'
import InteractiveWrapper from './InteractiveWrapper'
import useDynamicControls from '../Hooks/useDynamicControls'

import * as THREE from 'three'

export default function ClickCheck({
  models,
  setSelectedId,
  hovered,
  setHovered,
  mode
}) {
  return (
    <>
      {models.map(({ id, name, Component, defaults, visible, selected, renderMode }) => {
  const isHovered = hovered === id
  const { position, rotation } = useDynamicControls(id, defaults, id, mode)

  return (
    <InteractiveWrapper
      key={id}
      id={id}
      name={name}
      selected={selected}
      hovered={isHovered}
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
    color={selected ? 'orange' : 'white'}
    wireframe={renderMode === 'wireframe'}
    transparent={renderMode === 'wireframe'}
    opacity={renderMode === 'wireframe' ? 0.5 : 1}
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
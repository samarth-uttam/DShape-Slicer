import { useState } from 'react'
import InteractiveWrapper from './InteractiveWrapper'
import useDynamicControls from '../components/Hooks/useDynamicControls'


export default function ClickCheck({
  models,
  setSelectedId,
  hovered,
  setHovered,
  mode
}) {
  return (
    <>
      {models.map(({ id, name, Component, defaults, visible, selected }) => {
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
              visible={visible}
              scale={selected ? 1.3 : 1}
              position={position}
              rotation={rotation}
            >
              <Component />
            </mesh>
          </InteractiveWrapper>
        )
      })}
    </>
  )
}
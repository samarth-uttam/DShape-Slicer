import { useState } from 'react'
import InteractiveWrapper from './InteractiveWrapper'
import useDynamicControls from '../Hooks/useDynamicControls'



export default function ClickCheck({ objects, selected, setSelected, hovered, setHovered }) {
  if (!objects) return null;

  return (
    <>
      {objects.map(({ id, name, Component, defaults }) => {
        const { position, rotation, scale } = useDynamicControls(id, defaults);
        // console.log('LEVA CONTROLLED:', id, 'position:', position, 'rotation:', rotation);


        return (
          <InteractiveWrapper
            key={id}
            id={id}
            name={name}
            selected={selected === id}
            hovered={hovered === id}
            onClick={() => setSelected(id)}
            onPointerOver={() => setHovered(id)}
            onPointerOut={() => setHovered(null)}
          >
            <Component
              position={position}
              rotation={rotation}
              color={selected === id ? 'black' : hovered === id ? 'orange' : undefined}
              
            />
          </InteractiveWrapper>
        )
      })}
    </>
  );
}
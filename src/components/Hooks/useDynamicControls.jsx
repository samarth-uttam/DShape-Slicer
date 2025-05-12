import { useControls } from 'leva'

export default function useDynamicControls(id, defaults = {}) {
    
  const { position, rotation } = useControls(id, {
    position: {
      value: defaults.position || [0, 0, 0],
      min: -100,
      max: 100,
      step: 0.1
    },
    rotation: {
      value: defaults.rotation || [0, 0, 0],
      min: -Math.PI,
      max: Math.PI,
      step: 0.1
    }
  })

  return { position, rotation }
}

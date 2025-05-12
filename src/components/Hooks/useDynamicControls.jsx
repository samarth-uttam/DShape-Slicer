import { folder, useControls } from 'leva'

// Convert degrees to radians for internal use
const degToRad = (deg) => (deg * Math.PI) / 180

export default function useDynamicControls(id, defaults = {}) {
  const controls = useControls(id, {
    Position: folder({
      'X Position (mm)': { value: defaults.position?.[0] ?? 0, min: -100, max: 100, step: 0.1 },
      'Y Position (mm)': { value: defaults.position?.[1] ?? 0, min: -100, max: 100, step: 0.1 },
      'Z Position (mm)': { value: defaults.position?.[2] ?? 0, min: -100, max: 100, step: 0.1 }
    }),
    Rotation: folder({
      'X Rotation (°)': { value: 0, min: 0, max: 360, step: 30 },
      'Y Rotation (°)': { value: 0, min: 0, max: 360, step: 30 },
      'Z Rotation (°)': { value: 0, min: 0, max: 360, step: 30 }
    })
  }, { group: id });

  return {
    position: [
      controls['X Position (mm)'],
      controls['Y Position (mm)'],
      controls['Z Position (mm)']
    ],
    rotation: [
      degToRad(controls['X Rotation (°)']),
      degToRad(controls['Y Rotation (°)']),
      degToRad(controls['Z Rotation (°)'])
    ]
  }
}

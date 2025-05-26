import { useFrame } from '@react-three/fiber';
import { cameraRef } from '../Middle/ThreeViewerSection/ThreeViewer'; // adjust path

function CameraLogger() {
  useFrame(() => {
    if (cameraRef.current) {
      const pos = cameraRef.current.object.position;
      const target = cameraRef.current.target;

      console.log('🎯 Camera Position:');
      console.log(`x: ${pos.x}\ny: ${pos.y}\nz: ${pos.z}`);

      console.log('🔽 Camera Target:');
      console.log(`x: ${target.x}\ny: ${target.y}\nz: ${target.z}`);
    }
  });

  return null;
}

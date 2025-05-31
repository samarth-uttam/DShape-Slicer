import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export default function STLModel({ path, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], selected = false, onClick }) {
  const loader = new STLLoader();
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    loader.load(path, (loadedGeometry) => {
      // Compute center and recenters the geometry
      loadedGeometry.computeBoundingBox();
      const center = new THREE.Vector3();
      loadedGeometry.boundingBox.getCenter(center);
      loadedGeometry.translate(-center.x, -center.y, -center.z);
  
      // Compute size of the bounding box
      const size = new THREE.Vector3();
      loadedGeometry.boundingBox.getSize(size);
      const maxDimension = Math.max(size.x, size.y, size.z);
  
      // Define a desired max size (e.g. 10 units)
      const desiredSize = 10;
      const scaleFactor = desiredSize / maxDimension;
  
      console.log(`🔍 STL original size:`, size);
      console.log(`📏 Scale factor applied: ${scaleFactor}`);
  
      // Apply the scale to the geometry
      loadedGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
  
      setGeometry(loadedGeometry);
    });
  }, [path]);
  

  if (!geometry) return null;

  return (
    <group position={position} rotation={rotation} scale={scale} onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick();
    }}>
      <mesh geometry={geometry}>
  <meshStandardMaterial color={selected ? 'orange' : 'grey'} flatShading />
</mesh>
<Edges geometry={geometry} color={selected ? '#ff9900' : 'black'} />
    </group>
  );
  
}

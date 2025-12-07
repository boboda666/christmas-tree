import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleData, TreeState } from '../types';
import { generateParticles } from '../utils/geometry';

interface InteractiveParticlesProps {
  state: TreeState;
  count?: number;
}

// Colors: Ice Blue, Silver, White, Deep Blue accent
const PALETTE = [
  '#E0F7FA', // Ice Blue Light
  '#B2EBF2', // Ice Blue Medium
  '#FFFFFF', // White
  '#C0C0C0', // Silver
  '#90CAF9', // Soft Blue
];

const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({ state, count = 1500 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Dummy object for matrix calculations to avoid GC
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  
  // Generate data once
  const particles = useMemo(() => generateParticles({
    count,
    colorPalette: PALETTE,
    baseRadius: 3.5,
    height: 8,
    scatterRadius: 12
  }), [count]);

  // Current animation progress (0 = Scattered, 1 = Tree)
  const progress = useRef(0);
  const targetProgress = useRef(0);

  // Initialize colors
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      meshRef.current!.setColorAt(i, particle.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [particles]);

  useFrame((stateThree, delta) => {
    if (!meshRef.current) return;

    const time = stateThree.clock.elapsedTime;

    // Smoothly interpolate progress
    targetProgress.current = state === TreeState.TREE_SHAPE ? 1 : 0;
    // Simple lerp for the global transition state
    const smoothing = 2.5 * delta;
    progress.current += (targetProgress.current - progress.current) * smoothing;

    particles.forEach((particle, i) => {
      // 1. Interpolate Position
      // Linear interpolation between scatter and tree position based on progress
      tempPos.lerpVectors(particle.scatterPosition, particle.treePosition, progress.current);

      // 2. Add Floating Noise (Idle Animation)
      // When in tree form, float less. When scattered, float more.
      const floatIntensity = (1 - progress.current) * 1.5 + (progress.current * 0.1);
      
      const yNoise = Math.sin(time * particle.speed + particle.phase) * 0.2 * floatIntensity;
      const xNoise = Math.cos(time * particle.speed * 0.5 + particle.phase) * 0.1 * floatIntensity;
      
      dummy.position.set(
        tempPos.x + xNoise,
        tempPos.y + yNoise,
        tempPos.z // Keep Z relatively stable for depth perception stability
      );

      // 3. Rotation
      // Spin gently
      dummy.rotation.copy(particle.rotation);
      dummy.rotation.x += time * 0.1 * particle.speed;
      dummy.rotation.y += time * 0.2 * particle.speed;

      // 4. Scale
      // Pulse slightly
      const pulse = 1 + Math.sin(time * 2 + particle.phase) * 0.1;
      dummy.scale.setScalar(particle.scale * pulse);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        castShadow
        receiveShadow
      >
        {/* Diamond/Crystal Geometry for that "Precious" look */}
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          toneMapped={false}
          color="#ffffff"
          emissive="#001133"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </instancedMesh>
      
      {/* Internal Glow Light that moves up and down the tree */}
      <pointLight 
        ref={lightRef}
        position={[0, 0, 0]} 
        intensity={20} 
        color="#a5f3fc" 
        distance={10} 
        decay={2}
      />
    </group>
  );
};

export default InteractiveParticles;
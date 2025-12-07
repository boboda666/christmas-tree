import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeState } from '../types';
import InteractiveParticles from './InteractiveParticles';

interface SceneProps {
  treeState: TreeState;
}

const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
      className="w-full h-full block bg-gray-900"
      shadows
    >
      <color attach="background" args={['#050b14']} />
      
      {/* Camera Setup */}
      <PerspectiveCamera makeDefault position={[0, 2, 14]} fov={50} />
      
      {/* Controls: Auto-rotate for cinematic feel */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={5} 
        maxDistance={25}
        autoRotate={treeState === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />

      {/* Lighting: Moody and Dramatic */}
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={100} 
        color="#E0F7FA" 
        castShadow 
      />
      <pointLight position={[-10, -5, -10]} intensity={50} color="#4fc3f7" />

      {/* Environment Reflections */}
      <Environment preset="city" />

      {/* Content */}
      <Suspense fallback={null}>
        <group position={[0, -1, 0]}>
          <InteractiveParticles state={treeState} />
        </group>

        {/* Floating dust for atmosphere */}
        <Sparkles 
          count={200} 
          scale={15} 
          size={3} 
          speed={0.4} 
          opacity={0.2} 
          color="#ffffff" 
        />
      </Suspense>

      {/* Post Processing for the "Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Room } from './Room';
import { SplineEnvironment } from './SplineEnvironment';
import { ListBoard3D } from './ListBoard3D';
import { FloorCollider } from './FloorCollider';
import { FallingTaskPhysics } from './FallingTaskPhysics';
import { CameraController } from './CameraController';
import { useStore } from '../store/useStore';

export function Experience() {
  const physicsDebug = useStore((s) => s.physicsDebug);

  return (
    <Canvas
      shadows
      dpr={[1, 2]} // Performance clamp: max 2x pixel ratio to prevent mobile GPU throttling
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      }}
      camera={{ position: [0, 6, 22], fov: 50 }}
      style={{ width: '100vw', height: '100vh', background: '#030308' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Suspense fallback={null}>
        {/* Cinematic GSAP Camera Controller */}
        <CameraController />

        {/* Active Theory Minimal Sci-Fi Room */}
        <Room />

        {/* Spline 3D Spatial Asset Integration */}
        <SplineEnvironment />

        {/* Rapier 3D Physics Simulation World */}
        <Physics gravity={[0, -18.0, 0]} debug={physicsDebug}>
          {/* Ground & Wall Colliders */}
          <FloorCollider />

          {/* Floating Monolithic List & Task Boards */}
          <ListBoard3D />

          {/* Bruno Simon Task Completion Gravity Drop Simulation */}
          <FallingTaskPhysics />
        </Physics>

        {/* Active Theory Style Post-Processing Pipeline */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom
            luminanceThreshold={0.25}
            luminanceSmoothing={0.8}
            intensity={0.85}
            mipmapBlur
          />
          <ChromaticAberration
            offset={[0.0008, 0.0008]}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.9} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}


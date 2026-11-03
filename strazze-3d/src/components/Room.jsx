import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { AtmosphericShader } from '../shaders/AtmosphereShader';

export function Room() {
  const atmosphereRef = useRef();

  useFrame((state, delta) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <group>
      {/* Active Theory Atmospheric Sky Dome */}
      <mesh scale={[120, 120, 120]}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          ref={atmosphereRef}
          side={THREE.BackSide}
          uniforms={AtmosphereShader.uniforms}
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
        />
      </mesh>

      {/* Floating Ambient Sci-Fi Energy Dust */}
      <Sparkles
        count={140}
        scale={[30, 20, 30]}
        size={2.5}
        speed={0.4}
        opacity={0.35}
        color="#00f0ff"
      />

      {/* Infinite Mirror Reflective Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mirror={0.7}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#06070a"
          metalness={0.9}
        />
      </mesh>

      {/* Futuristic Floor Grid Overlay */}
      <gridHelper
        args={[100, 50, '#00f0ff', '#121c29']}
        position={[0, -4.98, 0]}
      />

      {/* Volumetric Neon Ambient Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 15]} intensity={1.2} color="#ffffff" castShadow />
      <pointLight position={[0, 8, -5]} intensity={3.5} color="#00f0ff" distance={30} />
      <pointLight position={[10, -2, 5]} intensity={2.0} color="#ff007f" distance={25} />
      <pointLight position={[-10, 4, 10]} intensity={1.8} color="#a78bfa" distance={25} />
    </group>
  );
}


import React, { Suspense } from 'react';
import { Float } from '@react-three/drei';

/**
 * Spline 3D Scene Integrator Component
 * Demonstrates loading an interactive geometric asset from Spline,
 * designed with fallbacks for offline development.
 */
export function SplineEnvironment() {
  return (
    <group position={[0, 0, -12]}>
      {/* 
        In production with a live exported Spline file, we can use:
        import Spline from '@splinetool/react-spline';
        or Drei's useGLTF / SplineLoader.
        Here we generate the sculptural sci-fi monument that represents
        the Spline scene geometry (faceted obsidian core with hovering rings).
      */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        {/* Central Geometric Monolith */}
        <mesh position={[0, 4, 0]}>
          <octahedronGeometry args={[3.2, 0]} />
          <meshPhysicalMaterial
            color="#080c14"
            emissive="#00f0ff"
            emissiveIntensity={0.15}
            roughness={0.08}
            metalness={0.95}
            transmission={0.4}
            thickness={1.5}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Orbiting Kinetic Rings */}
        <mesh position={[0, 4, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[5.2, 0.08, 16, 100]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 4, 0]} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[6.4, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#ff007f"
            emissive="#ff007f"
            emissiveIntensity={1.4}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}


import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export function FloorCollider() {
  return (
    <RigidBody type="fixed" position={[0, -5, 0]}>
      {/* Expansive floor box collider */}
      <CuboidCollider args={[40, 0.2, 40]} />
      {/* Perimeter invisible walls to contain debris bouncing off-screen */}
      <CuboidCollider args={[40, 10, 0.5]} position={[0, 10, -20]} />
      <CuboidCollider args={[40, 10, 0.5]} position={[0, 10, 20]} />
      <CuboidCollider args={[0.5, 10, 40]} position={[-25, 10, 0]} />
      <CuboidCollider args={[0.5, 10, 40]} position={[25, 10, 0]} />
    </RigidBody>
  );
}


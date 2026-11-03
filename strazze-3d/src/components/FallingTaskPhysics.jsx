import React, { useRef, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Text, RoundedBox } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { sound } from '../audio/AudioEngine';

function SingleFallenDebris({ task }) {
  const rigidRef = useRef();
  const removeFallen = useStore((s) => s.removeFallenTask);

  useEffect(() => {
    if (rigidRef.current) {
      // Apply a satisfying kick & tumbling angular momentum
      const impulse = {
        x: (Math.random() - 0.5) * 3.5,
        y: Math.random() * 2.0 + 1.0,
        z: Math.random() * 4.0 + 2.0
      };
      const torque = {
        x: (Math.random() - 0.5) * 8.0,
        y: (Math.random() - 0.5) * 8.0,
        z: (Math.random() - 0.5) * 8.0
      };

      rigidRef.current.applyImpulse(impulse, true);
      rigidRef.current.applyTorqueImpulse(torque, true);
    }

    // Auto-garbage collection after settling to prevent GPU/Physics memory leak
    const timer = setTimeout(() => {
      removeFallen(task.id);
    }, 7000);

    return () => clearTimeout(timer);
  }, [task.id]);

  const handleCollision = (e) => {
    // Play physical impact thud proportional to collision force
    sound.playPhysicsImpact(0.8);
  };

  return (
    <RigidBody
      ref={rigidRef}
      position={task.initialPos || [0, 2, 0]}
      colliders="cuboid"
      restitution={0.55} // Bounciness
      friction={0.6}
      linearDamping={0.3}
      angularDamping={0.4}
      onCollisionEnter={handleCollision}
    >
      <group>
        <RoundedBox args={[7.2, 1.15, 0.18]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#141c2b"
            emissive="#00f0ff"
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.7}
          />
        </RoundedBox>

        <Text
          position={[-2.5, 0.04, 0.12]}
          fontSize={0.26}
          maxWidth={5.2}
          color="#8b949e"
          anchorX="left"
          anchorY="middle"
        >
          {task.text}
        </Text>
      </group>
    </RigidBody>
  );
}

export function FallingTaskPhysics() {
  const fallingTasks = useStore((s) => s.fallingTasks);

  return (
    <group>
      {fallingTasks.map((task) => (
        <SingleFallenDebris key={task.id + '-' + task.droppedAt} task={task} />
      ))}
    </group>
  );
}


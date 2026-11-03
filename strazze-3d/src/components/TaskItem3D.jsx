import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { sound } from '../audio/AudioEngine';
import '../shaders/LusionDisplacementMaterial';

export function TaskItem3D({ item, index, position = [0, 0, 0], listColor = '#00f0ff' }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const toggleTask = useStore((s) => s.toggleTaskCompletion);

  const [hovered, setHovered] = useState(false);
  const hoverFactor = useRef(0);
  const mouseUv = useRef(new THREE.Vector2(0.5, 0.5));
  const targetTilt = useRef({ x: 0, y: 0, z: 0 });

  useFrame((state, delta) => {
    // 1. Smoothly interpolate hover intensity for shader displacement
    const targetHover = hovered ? 1.0 : 0.0;
    hoverFactor.current = THREE.MathUtils.lerp(hoverFactor.current, targetHover, delta * 12);

    if (materialRef.current) {
      materialRef.current.uHover = hoverFactor.current;
      materialRef.current.uTime = state.clock.getElapsedTime();
      materialRef.current.uMouse = mouseUv.current;
    }

    // 2. Lusion Magnetic pull towards cursor
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetTilt.current.x,
        delta * 10
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetTilt.current.y,
        delta * 10
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        position[2] + (hovered ? 0.35 : 0),
        delta * 10
      );
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    sound.playMagneticHover();
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    targetTilt.current = { x: 0, y: 0, z: 0 };
  };

  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (e.uv) {
      mouseUv.current.copy(e.uv);
      // Compute tilt angles based on UV offset from center (magnetic pull effect)
      targetTilt.current = {
        x: (e.uv.y - 0.5) * -0.25,
        y: (e.uv.x - 0.5) * 0.25,
        z: 0
      };
    }
  };

  const handleCompleteClick = (e) => {
    e.stopPropagation();
    if (!meshRef.current) return;

    // Capture exact world position for Bruno Simon physical detachment drop
    const worldPos = new THREE.Vector3();
    meshRef.current.getWorldPosition(worldPos);

    toggleTask(item.id, [worldPos.x, worldPos.y, worldPos.z]);
  };

  const priorityColor =
    item.priority === 'high' ? '#ff3366' : item.priority === 'medium' ? '#ffd93d' : '#6bffb8';

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
    >
      {/* 3D Distortable Card Body */}
      <mesh onClick={handleCompleteClick}>
        <boxGeometry args={[7.2, 1.15, 0.18, 32, 16, 4]} />
        {/* @ts-ignore */}
        <lusionDisplacementMaterial
          ref={materialRef}
          uColor={new THREE.Color('#0c1017')}
          uBorderColor={new THREE.Color(listColor)}
          uGlowIntensity={1.8}
          transparent
        />
      </mesh>

      {/* Futuristic Checkbox Trigger Node */}
      <group position={[-3.0, 0, 0.12]} onClick={handleCompleteClick}>
        <RoundedBox args={[0.42, 0.42, 0.12]} radius={0.06} smoothness={4}>
          <meshStandardMaterial
            color={item.completed ? '#00f0ff' : '#1a2230'}
            emissive={item.completed ? '#00f0ff' : '#000000'}
            emissiveIntensity={item.completed ? 1.5 : 0}
            roughness={0.2}
            metalness={0.8}
          />
        </RoundedBox>
      </group>

      {/* Task Text using 3D Distance-Field Text */}
      <Text
        position={[-2.5, 0.04, 0.14]}
        fontSize={0.28}
        maxWidth={5.2}
        color={item.completed ? '#4a5568' : '#e6edf3'}
        anchorX="left"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-g.woff"
      >
        {item.text}
      </Text>

      {/* Priority Indicator Pill */}
      <mesh position={[3.2, 0, 0.12]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={priorityColor}
          emissive={priorityColor}
          emissiveIntensity={1.8}
        />
      </mesh>
    </group>
  );
}


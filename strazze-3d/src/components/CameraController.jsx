import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../store/useStore';
import { sound } from '../audio/AudioEngine';

export function CameraController() {
  const { camera } = useThree();
  const cameraMode = useStore((s) => s.cameraMode);
  const activeListId = useStore((s) => s.activeListId);
  const activeSublistId = useStore((s) => s.activeSublistId);
  const setZoomTransitioning = useStore((s) => s.setZoomTransitioning);

  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    setZoomTransitioning(true);
    sound.playWhoosh();

    const timeline = gsap.timeline({
      onComplete: () => setZoomTransitioning(false)
    });

    if (cameraMode === 'overview') {
      // Wide panoramic sci-fi perspective
      timeline.to(camera.position, {
        x: 0,
        y: 6,
        z: 22,
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0);

      timeline.to(lookAtTarget.current, {
        x: 0,
        y: 1,
        z: 0,
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0);

      // Camera FOV elastic breath
      if (camera.isPerspectiveCamera) {
        timeline.to(camera, {
          fov: 55,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0);
      }
    } else if (cameraMode === 'list-focus') {
      // Zoom into the active list board with Ohzi-style punch
      timeline.to(camera.position, {
        x: 0,
        y: 1.5,
        z: 11,
        duration: 1.4,
        ease: 'expo.inOut'
      }, 0);

      timeline.to(lookAtTarget.current, {
        x: 0,
        y: 1.5,
        z: 0,
        duration: 1.4,
        ease: 'expo.inOut'
      }, 0);

      if (camera.isPerspectiveCamera) {
        timeline.to(camera, {
          fov: 48,
          duration: 1.4,
          ease: 'expo.out',
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0);
      }
    } else if (cameraMode === 'sublist-deep') {
      // Infinite zoom through the subtask portal
      timeline.to(camera.position, {
        x: 1.5,
        y: 0.8,
        z: 5.5,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 0);

      timeline.to(lookAtTarget.current, {
        x: 1.5,
        y: 0.8,
        z: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 0);

      if (camera.isPerspectiveCamera) {
        timeline.to(camera, {
          fov: 42,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0);
      }
    }

    return () => {
      timeline.kill();
    };
  }, [cameraMode, activeListId, activeSublistId]);

  // Smoothly interpolate lookAt every frame
  useFrame(() => {
    currentLookAt.current.lerp(lookAtTarget.current, 0.08);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}


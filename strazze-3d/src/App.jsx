import React, { useEffect } from 'react';
import { Experience } from './components/Experience';
import { HUD } from './components/HUD';
import { useStore } from './store/useStore';
import { sound } from './audio/AudioEngine';

export default function App() {
  const resetToOverview = useStore((s) => s.resetToOverview);
  const toggleSound = useStore((s) => s.toggleSound);
  const soundEnabled = useStore((s) => s.soundEnabled);

  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetToOverview();
      } else if (e.key === 'm' || e.key === 'M') {
        // Toggle sound only if not typing in input
        if (e.target.tagName !== 'INPUT') {
          toggleSound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <HUD />
      <Experience />
    </div>
  );
}


import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Volume2, VolumeX, Plus, Grid, ArrowLeft, Activity, ShieldCheck } from 'lucide-react';

export function HUD() {
  const lists = useStore((s) => s.lists);
  const activeListId = useStore((s) => s.activeListId);
  const activeSublistId = useStore((s) => s.activeSublistId);
  const cameraMode = useStore((s) => s.cameraMode);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const fallingTasks = useStore((s) => s.fallingTasks);

  const setActiveList = useStore((s) => s.setActiveList);
  const resetToOverview = useStore((s) => s.resetToOverview);
  const toggleSound = useStore((s) => s.toggleSound);
  const addTask = useStore((s) => s.addTask);

  const [inputOpen, setInputOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  const activeList = lists.find((l) => l.id === activeListId);

  const handleCreate = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      addTask(taskText.trim(), taskPriority);
      setTaskText('');
      setInputOpen(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 32px',
        zIndex: 100,
        fontFamily: "'Space Grotesk', sans-serif"
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#00f0ff',
              textShadow: '0 0 12px rgba(0, 240, 255, 0.4)'
            }}
          >
            STRAZZECLOUD // SPATIAL OS
          </div>
          <span
            style={{
              fontSize: '11px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00f0ff',
              padding: '2px 8px',
              borderRadius: '999px',
              letterSpacing: '1px'
            }}
          >
            ACTIVE THEORY MODE
          </span>
        </div>

        {/* Global Controls & Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {cameraMode !== 'overview' && (
            <button
              onClick={resetToOverview}
              style={{
                background: 'rgba(16, 24, 38, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f0ede8',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s'
              }}
            >
              <Grid size={15} /> OVERVIEW
            </button>
          )}

          {cameraMode === 'sublist-deep' && (
            <button
              onClick={() => setActiveList(activeListId)}
              style={{
                background: 'rgba(16, 24, 38, 0.85)',
                border: '1px solid #a78bfa',
                color: '#a78bfa',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ArrowLeft size={15} /> BACK TO LIST
            </button>
          )}

          {cameraMode === 'list-focus' && (
            <button
              onClick={() => setInputOpen(!inputOpen)}
              style={{
                background: '#00f0ff',
                border: 'none',
                color: '#030308',
                padding: '8px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
              }}
            >
              <Plus size={16} /> NEW DIRECTIVE
            </button>
          )}

          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(16, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: soundEnabled ? '#00f0ff' : '#6b7280',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      {/* Quick Add Directive Modal */}
      {inputOpen && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '32px',
            width: '360px',
            background: 'rgba(8, 12, 20, 0.94)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 18px rgba(0, 240, 255, 0.2)',
            borderRadius: '12px',
            padding: '18px',
            backdropFilter: 'blur(16px)',
            pointerEvents: 'auto'
          }}
        >
          <form onSubmit={handleCreate}>
            <div style={{ fontSize: '11px', color: '#00f0ff', letterSpacing: '1px', marginBottom: '8px' }}>
              SPATIAL TASK CREATOR
            </div>
            <input
              type="text"
              placeholder="Directive description..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTaskPriority(p)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: taskPriority === p ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
                    background: taskPriority === p ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                    color: taskPriority === p ? '#00f0ff' : '#8b949e',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setInputOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8b949e',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '6px 12px'
                }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                style={{
                  background: '#00f0ff',
                  border: 'none',
                  color: '#030308',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '6px 16px'
                }}
              >
                DEPLOY 3D
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Telemetry Bar */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div
            style={{
              background: 'rgba(8, 12, 20, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '8px 14px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#8b949e'
            }}
          >
            <Activity size={14} color="#00f0ff" />
            <span>KINETIC DEBRIS FALLING:</span>
            <span style={{ color: '#00f0ff', fontWeight: 700 }}>{fallingTasks.length}</span>
          </div>

          <div
            style={{
              background: 'rgba(8, 12, 20, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '8px 14px',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              fontSize: '12px',
              color: '#8b949e'
            }}
          >
            INTERACTION: <span style={{ color: '#ff007f' }}>LUSION MAGNETIC HOVER</span> +{' '}
            <span style={{ color: '#00f0ff' }}>BRUNO SIMON PHYSICS DROP</span>
          </div>
        </div>

        {/* List Switcher Quick-Bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {lists.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveList(l.id)}
              style={{
                background:
                  activeListId === l.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(8, 12, 20, 0.75)',
                border:
                  activeListId === l.id
                    ? '1px solid #00f0ff'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeListId === l.id ? '#00f0ff' : '#8b949e',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              {l.emoji} {l.title}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}


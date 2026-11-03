import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Data Model
  lists: [
    {
      id: 'list-work',
      title: 'QUANTUM OS CORE',
      category: 'Engineering',
      color: '#00f0ff',
      emoji: '⚡',
      items: [
        { id: 't-1', text: 'Optimize GLSL Vertex Shaders for Mobile GPU', completed: false, priority: 'high', subtasksCount: 3 },
        { id: 't-2', text: 'Integrate Spline 3D Spatial Gateway Model', completed: false, priority: 'high', subtasksCount: 1 },
        { id: 't-3', text: 'Configure Rapier Physics Restitution & Damping', completed: false, priority: 'medium', subtasksCount: 0 },
        { id: 't-4', text: 'Build MSDF Typography Distance-Field Pipeline', completed: false, priority: 'low', subtasksCount: 2 }
      ],
      sublists: [
        {
          id: 'sublist-kernel',
          title: 'Kernel Subsystem',
          items: [
            { id: 'sub-1', text: 'Thread Memory Defragmentation', completed: false, priority: 'high' },
            { id: 'sub-2', text: 'Hardware Acceleration Bus', completed: false, priority: 'medium' }
          ]
        }
      ]
    },
    {
      id: 'list-design',
      title: 'SYNAPSE CREATIVE LAB',
      category: 'Design',
      color: '#ff007f',
      emoji: '🔮',
      items: [
        { id: 't-5', text: 'Active Theory Volumetric Atmospheric Lighting', completed: false, priority: 'high', subtasksCount: 2 },
        { id: 't-6', text: 'Lusion Magnetic Hover Curl-Noise Proximity', completed: false, priority: 'high', subtasksCount: 0 },
        { id: 't-7', text: 'Bruno Simon Kinetic Task Debris Simulation', completed: false, priority: 'medium', subtasksCount: 1 }
      ],
      sublists: []
    },
    {
      id: 'list-personal',
      title: 'NEURAL HORIZONS',
      category: 'Personal',
      color: '#a78bfa',
      emoji: '🪐',
      items: [
        { id: 't-8', text: 'Calibrate Spatial Audio Binaural Frequencies', completed: false, priority: 'medium', subtasksCount: 0 },
        { id: 't-9', text: 'Sync PolyHaven 4K Studio HDRI Environmental Map', completed: false, priority: 'low', subtasksCount: 0 }
      ],
      sublists: []
    }
  ],

  // Navigation & Spatial State
  activeListId: 'list-work',
  activeSublistId: null,
  cameraMode: 'overview', // 'overview' | 'list-focus' | 'sublist-deep'
  zoomTransitioning: false,

  // Physics Falling Queue for Bruno Simon effect
  fallingTasks: [],

  // Audio & Settings
  soundEnabled: true,
  hapticsEnabled: true,
  physicsDebug: false,

  // Actions
  setActiveList: (listId) => {
    set({
      activeListId: listId,
      activeSublistId: null,
      cameraMode: 'list-focus'
    });
  },

  setActiveSublist: (sublistId) => {
    set({
      activeSublistId: sublistId,
      cameraMode: 'sublist-deep'
    });
  },

  resetToOverview: () => {
    set({
      activeListId: null,
      activeSublistId: null,
      cameraMode: 'overview'
    });
  },

  toggleTaskCompletion: (taskId, initialPos = [0, 0, 0]) => {
    const state = get();
    const currentList = state.lists.find((l) => l.id === state.activeListId);
    if (!currentList) return;

    let targetTask = currentList.items.find((i) => i.id === taskId);
    let isSublist = false;

    if (!targetTask && state.activeSublistId) {
      const sublist = currentList.sublists.find((s) => s.id === state.activeSublistId);
      if (sublist) {
        targetTask = sublist.items.find((i) => i.id === taskId);
        isSublist = true;
      }
    }

    if (!targetTask) return;

    const nextCompleted = !targetTask.completed;

    if (nextCompleted) {
      // Add to falling physics simulation
      const fallingItem = {
        ...targetTask,
        initialPos: [...initialPos],
        droppedAt: Date.now()
      };

      set((s) => ({
        fallingTasks: [...s.fallingTasks, fallingItem]
      }));
    }

    // Update list data
    set((s) => ({
      lists: s.lists.map((list) => {
        if (list.id !== s.activeListId) return list;
        if (!isSublist) {
          return {
            ...list,
            items: list.items.map((item) =>
              item.id === taskId ? { ...item, completed: nextCompleted } : item
            )
          };
        } else {
          return {
            ...list,
            sublists: list.sublists.map((sub) =>
              sub.id === s.activeSublistId
                ? {
                    ...sub,
                    items: sub.items.map((item) =>
                      item.id === taskId ? { ...item, completed: nextCompleted } : item
                    )
                  }
                : sub
            )
          };
        }
      })
    }));
  },

  removeFallenTask: (taskId) => {
    set((s) => ({
      fallingTasks: s.fallingTasks.filter((t) => t.id !== taskId)
    }));
  },

  addTask: (text, priority = 'medium') => {
    const state = get();
    if (!state.activeListId) return;

    const newTask = {
      id: `task-${Date.now()}`,
      text: text.trim() || 'New Directive',
      completed: false,
      priority,
      subtasksCount: 0
    };

    set((s) => ({
      lists: s.lists.map((l) =>
        l.id === s.activeListId ? { ...l, items: [newTask, ...l.items] } : l
      )
    }));
  },

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  togglePhysicsDebug: () => set((s) => ({ physicsDebug: !s.physicsDebug })),
  setZoomTransitioning: (val) => set({ zoomTransitioning: val })
}));


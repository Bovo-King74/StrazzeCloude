import React from 'react';
import { Text, Float, RoundedBox } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { TaskItem3D } from './TaskItem3D';

export function ListBoard3D() {
  const lists = useStore((s) => s.lists);
  const activeListId = useStore((s) => s.activeListId);
  const activeSublistId = useStore((s) => s.activeSublistId);
  const cameraMode = useStore((s) => s.cameraMode);
  const setActiveList = useStore((s) => s.setActiveList);
  const setActiveSublist = useStore((s) => s.setActiveSublist);

  const activeList = lists.find((l) => l.id === activeListId);

  // OVERVIEW MODE: Render all 3 lists as hovering monolithic slabs side-by-side
  if (cameraMode === 'overview') {
    return (
      <group position={[0, 1.5, 0]}>
        {lists.map((list, idx) => {
          const xOffset = (idx - 1) * 8.5;
          return (
            <Float key={list.id} speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <group
                position={[xOffset, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveList(list.id);
                }}
              >
                {/* List Monolith Slab */}
                <RoundedBox args={[7.2, 8.5, 0.3]} radius={0.2} smoothness={4}>
                  <meshPhysicalMaterial
                    color="#090d15"
                    roughness={0.15}
                    metalness={0.8}
                    transmission={0.3}
                    thickness={1.2}
                    emissive={list.color}
                    emissiveIntensity={0.18}
                  />
                </RoundedBox>

                {/* Header Text */}
                <Text
                  position={[0, 3.2, 0.22]}
                  fontSize={0.4}
                  color={list.color}
                  anchorX="center"
                  anchorY="middle"
                >
                  {list.emoji + '  ' + list.title}
                </Text>

                <Text
                  position={[0, 2.5, 0.22]}
                  fontSize={0.24}
                  color="#8b949e"
                  anchorX="center"
                  anchorY="middle"
                >
                  {list.category.toUpperCase()} • {list.items.filter((i) => !i.completed).length} DIRECTIVES
                </Text>

                {/* Preview Tasks */}
                {list.items.slice(0, 3).map((item, itemIdx) => (
                  <group key={item.id} position={[0, 1.2 - itemIdx * 1.4, 0.22]}>
                    <RoundedBox args={[6.2, 0.9, 0.1]} radius={0.06} smoothness={2}>
                      <meshStandardMaterial color="#101724" roughness={0.4} />
                    </RoundedBox>
                    <Text
                      position={[-2.7, 0, 0.08]}
                      fontSize={0.22}
                      maxWidth={5.4}
                      color="#e6edf3"
                      anchorX="left"
                      anchorY="middle"
                    >
                      {item.text}
                    </Text>
                  </group>
                ))}

                {/* Click to Enter Prompt */}
                <Text
                  position={[0, -3.4, 0.22]}
                  fontSize={0.22}
                  color={list.color}
                  anchorX="center"
                  anchorY="middle"
                >
                  [ CLICK TO ENGAGE SPATIAL LIST ]
                </Text>
              </group>
            </Float>
          );
        })}
      </group>
    );
  }

  // SUBLIST DEEP DIVE MODE: Ohzi style deep dive into sub-tasks
  if (cameraMode === 'sublist-deep' && activeList) {
    const sublist = activeList.sublists.find((s) => s.id === activeSublistId);
    if (!sublist) return null;

    return (
      <group position={[1.5, 0.8, 0]}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          {/* Sublist Monolith */}
          <RoundedBox args={[8.0, 7.0, 0.3]} radius={0.2} smoothness={4}>
            <meshPhysicalMaterial
              color="#0b101c"
              emissive="#a78bfa"
              emissiveIntensity={0.25}
              roughness={0.15}
              metalness={0.8}
            />
          </RoundedBox>

          <Text
            position={[0, 2.7, 0.25]}
            fontSize={0.38}
            color="#a78bfa"
            anchorX="center"
            anchorY="middle"
          >
            {'❖  ' + sublist.title.toUpperCase()}
          </Text>

          {/* Subtask Items */}
          {sublist.items.map((subItem, idx) => (
            <TaskItem3D
              key={subItem.id}
              item={subItem}
              index={idx}
              position={[0, 1.3 - idx * 1.5, 0.25]}
              listColor="#a78bfa"
            />
          ))}
        </Float>
      </group>
    );
  }

  // LIST FOCUS MODE: Active List items + Sublist Portals
  if (!activeList) return null;

  const activeItems = activeList.items.filter((i) => !i.completed);

  return (
    <group position={[0, 1.5, 0]}>
      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.25}>
        {/* Floating Category Indicator */}
        <Text
          position={[-3.6, 2.7, 0.2]}
          fontSize={0.28}
          color="#8b949e"
          anchorX="left"
          anchorY="middle"
        >
          {activeList.category.toUpperCase()} // ACTIVE SESSION
        </Text>

        <Text
          position={[-3.6, 2.2, 0.2]}
          fontSize={0.52}
          color={activeList.color}
          anchorX="left"
          anchorY="middle"
        >
          {activeList.emoji + ' ' + activeList.title}
        </Text>

        {/* Task Items in 3D Space */}
        {activeItems.map((item, idx) => {
          const yPos = 1.0 - idx * 1.45;
          return (
            <TaskItem3D
              key={item.id}
              item={item}
              index={idx}
              position={[0, yPos, 0]}
              listColor={activeList.color}
            />
          );
        })}

        {/* Sublist Portals (Clickable infinite zoom gateway) */}
        {activeList.sublists.map((sub, sIdx) => {
          const yPos = 1.0 - activeItems.length * 1.45 - sIdx * 1.3;
          return (
            <group
              key={sub.id}
              position={[0, yPos, 0]}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSublist(sub.id);
              }}
            >
              <RoundedBox args={[7.2, 0.95, 0.16]} radius={0.08} smoothness={4}>
                <meshStandardMaterial
                  color="#151329"
                  emissive="#a78bfa"
                  emissiveIntensity={0.4}
                  roughness={0.2}
                />
              </RoundedBox>
              <Text
                position={[-2.8, 0, 0.14]}
                fontSize={0.26}
                color="#c4b5fd"
                anchorX="left"
                anchorY="middle"
              >
                {'❖ SUB-SYSTEM: ' + sub.title + ' (' + sub.items.length + ' directives) ➔'}
              </Text>
            </group>
          );
        })}
      </Float>
    </group>
  );
}


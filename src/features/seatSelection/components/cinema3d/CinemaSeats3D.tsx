// CinemaSeats3D.tsx — Asientos 3D para la sala de cine
// Portado y adaptado desde sala3D-cinema con la paleta de colores del proyecto actual.

import React, { useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { SeatData } from '../../data/seatData';

interface CinemaSeatsProps {
  seats: SeatData[];
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatData) => void;
}

// ─── Geometrías compartidas (evita instanciación por cada mesh) ─────────────
const standGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
const cushionGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
const backrestGeometry = new THREE.BoxGeometry(0.8, 0.7, 0.15);
const headrestGeometry = new THREE.BoxGeometry(0.6, 0.25, 0.15);
const armrestGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.7);
const numberGeometry = new THREE.PlaneGeometry(0.2, 0.1);

// ─── Materiales compartidos ─────────────────────────────────────────────────
const legsMaterial = new THREE.MeshStandardMaterial({
  color: '#1f2937', roughness: 0.8, metalness: 0.2,
});
const armrestMaterial = new THREE.MeshStandardMaterial({
  color: '#111827', roughness: 0.9,
});
const occupiedMaterial = new THREE.MeshStandardMaterial({
  color: '#374151', roughness: 0.6, metalness: 0.1,
});

// Seleccionado → emerald
const selectedMaterial = new THREE.MeshStandardMaterial({
  color: '#10b981', roughness: 0.6, metalness: 0.1,
  emissive: '#047857', emissiveIntensity: 0.35,
});
const selectedHoverMaterial = new THREE.MeshStandardMaterial({
  color: '#34d399', roughness: 0.4, metalness: 0.1,
  emissive: '#047857', emissiveIntensity: 0.4,
});

// VIP → yellow-500 del proyecto
const vipMaterial = new THREE.MeshStandardMaterial({
  color: '#eab308', roughness: 0.6, metalness: 0.15,
  emissive: '#713f12', emissiveIntensity: 0.15,
});
const vipHoverMaterial = new THREE.MeshStandardMaterial({
  color: '#facc15', roughness: 0.4, metalness: 0.15,
  emissive: '#713f12', emissiveIntensity: 0.2,
});

// Standard → rojo neutral
const standardMaterial = new THREE.MeshStandardMaterial({
  color: '#ef4444', roughness: 0.6, metalness: 0.1,
});
const standardHoverMaterial = new THREE.MeshStandardMaterial({
  color: '#f87171', roughness: 0.4, metalness: 0.1,
});

const numberOccupiedMaterial = new THREE.MeshBasicMaterial({ color: '#4b5563' });
const numberAvailableMaterial = new THREE.MeshBasicMaterial({ color: '#9ca3af' });

// ─── Componente individual de asiento 3D ────────────────────────────────────
const CinemaSeat3D = memo<{
  seat: SeatData;
  isSelected: boolean;
  onClick: () => void;
}>(({ seat, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // Animación suave de escala en hover (GC-free, para cuando la animación termina)
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.06 : 1.0;
      const currentScale = meshRef.current.scale.x;
      if (Math.abs(currentScale - targetScale) > 0.001) {
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);
        meshRef.current.scale.set(newScale, newScale, newScale);
      } else if (currentScale !== targetScale) {
        meshRef.current.scale.set(targetScale, targetScale, targetScale);
      }
    }
  });

  const getSeatMaterial = () => {
    if (seat.status === 'occupied') return occupiedMaterial;
    if (isSelected) return hovered ? selectedHoverMaterial : selectedMaterial;
    if (seat.type === 'vip') return hovered ? vipHoverMaterial : vipMaterial;
    return hovered ? standardHoverMaterial : standardMaterial;
  };

  const currentSeatMaterial = getSeatMaterial();
  const currentNumberMaterial = seat.status === 'occupied' ? numberOccupiedMaterial : numberAvailableMaterial;

  return (
    <group
      ref={meshRef}
      position={seat.position}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (pointerDownPos.current) {
          const dx = e.clientX - pointerDownPos.current.x;
          const dy = e.clientY - pointerDownPos.current.y;
          if (Math.sqrt(dx * dx + dy * dy) < 5 && seat.status !== 'occupied') {
            onClick();
          }
          pointerDownPos.current = null;
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (seat.status !== 'occupied') {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Pata/base */}
      <mesh position={[0, 0.15, 0]} geometry={standGeometry} material={legsMaterial} castShadow receiveShadow />
      {/* Cojín del asiento */}
      <mesh position={[0, 0.35, 0]} geometry={cushionGeometry} material={currentSeatMaterial} castShadow receiveShadow />
      {/* Respaldo */}
      <mesh position={[0, 0.75, 0.35]} rotation={[0.1, 0, 0]} geometry={backrestGeometry} material={currentSeatMaterial} castShadow receiveShadow />
      {/* Reposacabezas (solo VIP) */}
      {seat.type === 'vip' && (
        <mesh position={[0, 1.15, 0.4]} rotation={[0.1, 0, 0]} geometry={headrestGeometry} material={currentSeatMaterial} castShadow receiveShadow />
      )}
      {/* Apoyabrazos izquierdo */}
      <mesh position={[-0.675, 0.55, 0]} geometry={armrestGeometry} material={armrestMaterial} castShadow receiveShadow />
      {/* Apoyabrazos derecho (solo en el último asiento de la fila) */}
      {seat.col === 8 && (
        <mesh position={[0.675, 0.55, 0]} geometry={armrestGeometry} material={armrestMaterial} castShadow receiveShadow />
      )}
      {/* Indicador numérico del asiento */}
      <mesh position={[0, 0.8, -0.42]} rotation={[0, Math.PI, 0]} geometry={numberGeometry} material={currentNumberMaterial} />
    </group>
  );
});

CinemaSeat3D.displayName = 'CinemaSeat3D';

// ─── Componente principal: grilla de asientos ────────────────────────────────
export const CinemaSeats3D: React.FC<CinemaSeatsProps> = ({ seats, selectedSeatIds, onSeatClick }) => {
  return (
    <group>
      {seats.map((seat) => (
        <CinemaSeat3D
          key={seat.id}
          seat={seat}
          isSelected={selectedSeatIds.includes(seat.id)}
          onClick={() => onSeatClick(seat)}
        />
      ))}
    </group>
  );
};

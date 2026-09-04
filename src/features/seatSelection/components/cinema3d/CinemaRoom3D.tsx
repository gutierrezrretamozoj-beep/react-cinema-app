// CinemaRoom3D.tsx — Escena 3D completa de la sala de cine
// Portado de sala3D-cinema e integrado con los componentes adaptados del proyecto.
// Incluye un loading spinner suspendido premium en 3D mientras carga.

import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { CinemaSeats3D } from './CinemaSeats3D';
import { CinemaScreen3D } from './CinemaScreen3D';
import { CinemaLights3D } from './CinemaLights3D';
import { CinemaCamera3D } from './CinemaCamera3D';
import type { SeatData } from '../../data/seatData';

interface CinemaRoomProps {
  seats: SeatData[];
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatData) => void;
  cameraMode: 'orbit' | 'seat';
  activeSeatForCamera: SeatData | null;
  videoUrl: string;
  videoPlaying: boolean;
  videoMuted: boolean;
}

// Componente Loader flotante en el espacio 3D durante la inicialización
function Loader3D() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-neutral-950/90 border border-neutral-800 p-6 rounded-2xl shadow-2xl backdrop-blur-md min-w-[200px] select-none text-center">
        {/* Spinner animado dorado */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-800 border-t-yellow-500 mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">Cargando Sala 3D</p>
        <p className="text-[10px] text-neutral-500 mt-1.5 font-mono">{progress.toFixed(0)}% completado</p>
      </div>
    </Html>
  );
}

export const CinemaRoom3D: React.FC<CinemaRoomProps> = ({
  seats,
  selectedSeatIds,
  onSeatClick,
  cameraMode,
  activeSeatForCamera,
  videoUrl,
  videoPlaying,
  videoMuted,
}) => {
  const rowsCount = 6;

  // Plataformas escalonadas (stadium seating) — memoizado para evitar recreación
  const risers = useMemo(() => {
    return Array.from({ length: rowsCount }).map((_, r) => {
      const height = r * 0.35 + 0.1;
      const zPos = (r - 2.5) * 2.2 + 2;
      return (
        <mesh key={r} position={[0, height / 2, zPos]} receiveShadow castShadow>
          <boxGeometry args={[11.5, height, 2.0]} />
          <meshStandardMaterial color="#13101c" roughness={0.85} metalness={0.1} />
        </mesh>
      );
    });
  }, []);

  // Paneles acústicos en paredes — memoizado
  const wallPanels = useMemo(() => {
    const panels: React.ReactElement[] = [];
    [-9, -6, -3, 0, 3, 6, 9].forEach((z, idx) => {
      panels.push(
        <mesh key={`l-${idx}`} position={[-8.9, 3.5, z]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 4.5, 1.8]} />
          <meshStandardMaterial color="#1e1533" roughness={0.8} />
        </mesh>,
        <mesh key={`r-${idx}`} position={[8.9, 3.5, z]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 4.5, 1.8]} />
          <meshStandardMaterial color="#1e1533" roughness={0.8} />
        </mesh>,
      );
    });
    return panels;
  }, []);

  // LEDs de pasillo (tiras doradas) — memoizado
  const stepLEDs = useMemo(() => {
    return Array.from({ length: rowsCount - 1 }).map((_, r) => {
      const zPos = (r - 1.5) * 2.2 + 0.9;
      const yPos = (r + 1) * 0.35 + 0.08;
      return (
        <group key={`led-${r}`}>
          <mesh position={[-5.6, yPos, zPos]}>
            <boxGeometry args={[0.4, 0.02, 0.05]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          <mesh position={[5.6, yPos, zPos]}>
            <boxGeometry args={[0.4, 0.02, 0.05]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
      );
    });
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows="percentage"
        camera={{ position: [0, 8, 14], fov: 50, near: 0.1, far: 50 }}
        gl={{ antialias: true }}
      >
        {/* Fondo oscuro del proyecto */}
        <color attach="background" args={['#08060d']} />
        {/* Niebla atmosférica del teatro */}
        <fog attach="fog" args={['#08060d', 16, 32]} />

        {/* Control de cámara (orbital / seat) */}
        <CinemaCamera3D mode={cameraMode} selectedSeat={activeSeatForCamera} />

        {/* Envolver recursos pesados en un Suspense para mostrar spinner */}
        <Suspense fallback={<Loader3D />}>
          {/* Iluminación de la sala */}
          <CinemaLights3D isPlaying={videoPlaying} />

          {/* Pantalla de cine con tráiler dinámico */}
          <CinemaScreen3D videoUrl={videoUrl} isPlaying={videoPlaying} isMuted={videoMuted} />

          {/* Grilla interactiva de asientos */}
          <CinemaSeats3D
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={onSeatClick}
          />

          {/* Suelo (alfombra) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
            <planeGeometry args={[18, 32]} />
            <meshStandardMaterial color="#100c18" roughness={0.9} />
          </mesh>

          {/* Techo */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, -2]} receiveShadow>
            <planeGeometry args={[18, 32]} />
            <meshStandardMaterial color="#06040a" roughness={0.9} />
          </mesh>

          {/* Pared trasera */}
          <mesh position={[0, 4, 13.9]} receiveShadow>
            <boxGeometry args={[18, 8, 0.2]} />
            <meshStandardMaterial color="#0c0a12" roughness={0.9} />
          </mesh>

          {/* Pared izquierda */}
          <mesh position={[-9, 4, -2]} receiveShadow>
            <boxGeometry args={[0.2, 8, 32]} />
            <meshStandardMaterial color="#0e0c15" roughness={0.9} />
          </mesh>

          {/* Pared derecha */}
          <mesh position={[9, 4, -2]} receiveShadow>
            <boxGeometry args={[0.2, 8, 32]} />
            <meshStandardMaterial color="#0e0c15" roughness={0.9} />
          </mesh>

          {/* Plataformas escalonadas */}
          {risers}
          {/* Paneles acústicos */}
          {wallPanels}
          {/* LEDs de pasillo */}
          {stepLEDs}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CinemaRoom3D;

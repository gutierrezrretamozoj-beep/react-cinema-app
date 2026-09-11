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
  dimLights?: boolean;
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
  dimLights = false,
}) => {
  // Detectar la cantidad real de filas y columnas a partir de los datos de asientos
  const { rowsCount, colsCount, isImax } = useMemo(() => {
    if (!seats || seats.length === 0) return { rowsCount: 6, colsCount: 8, isImax: false };
    const uniqueRows = new Set(seats.map((s) => s.row));
    const maxCol = Math.max(...seats.map((s) => s.col), 8);
    const imax = uniqueRows.size > 6 || maxCol > 8;
    return { rowsCount: uniqueRows.size, colsCount: maxCol, isImax: imax };
  }, [seats]);

  const riserWidth = Math.max(11.5, colsCount * 1.35 + 2.2); // Incluye holgura del pasillo
  const midRow = (rowsCount - 1) / 2;

  // Ensanchamiento proporcional de la sala:
  // Sala IMAX: roomWidth = 32 para alojar con holgura la pantalla de 27.4
  // Sala Estándar: roomWidth = 23 para alojar la pantalla de 18.72
  const roomWidth = isImax ? 32 : 23;
  const roomDepth = isImax ? 40 : 34;
  const halfRoomWidth = roomWidth / 2;
  const ceilingHeight = isImax ? 11.2 : 9.6;
  const frontWallZ = isImax ? -19.5 : -17.5;
  const screenCenterY = isImax ? 7.6 : 5.8;
  const screenCenterZ = isImax ? -18.2 : -16.2;

  // Calibración exacta de profundidad visual (4.2 para IMAX)
  const baseDistanceZ = isImax ? 3.2 : 2.0;

  // Plataformas escalonadas (stadium seating) — calculadas dinámicamente
  const risers = useMemo(() => {
    return Array.from({ length: rowsCount }).map((_, r) => {
      const height = r * 0.35 + 0.1;
      const zPos = (r - midRow) * 2.2 + baseDistanceZ;
      return (
        <mesh key={r} position={[0, height / 2, zPos]} receiveShadow castShadow>
          <boxGeometry args={[riserWidth, height, 2.0]} />
          <meshStandardMaterial color="#13101c" roughness={0.85} metalness={0.1} />
        </mesh>
      );
    });
  }, [rowsCount, riserWidth, midRow, baseDistanceZ]);

  // Paneles acústicos en paredes — memoizado
  const wallPanels = useMemo(() => {
    const panels: React.ReactElement[] = [];
    const wallX = halfRoomWidth - 0.1;
    [-11, -8, -5, -2, 1, 4, 7, 10, 13, 16].forEach((z, idx) => {
      panels.push(
        <mesh key={`l-${idx}`} position={[-wallX, 4.5, z]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 5, 1.8]} />
          <meshStandardMaterial color="#1e1533" roughness={0.8} />
        </mesh>,
        <mesh key={`r-${idx}`} position={[wallX, 4.5, z]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 5, 1.8]} />
          <meshStandardMaterial color="#1e1533" roughness={0.8} />
        </mesh>,
      );
    });
    return panels;
  }, [halfRoomWidth]);

  // LEDs de pasillo (tiras doradas) — memoizado
  const stepLEDs = useMemo(() => {
    const halfWidth = riserWidth / 2 + 0.1;
    return Array.from({ length: Math.max(1, rowsCount - 1) }).map((_, r) => {
      const zPos = (r - midRow + 0.5) * 2.2 + (baseDistanceZ - 1.1);
      const yPos = (r + 1) * 0.35 + 0.08;
      return (
        <group key={`led-${r}`}>
          <mesh position={[-halfWidth, yPos, zPos]}>
            <boxGeometry args={[0.4, 0.02, 0.05]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          <mesh position={[halfWidth, yPos, zPos]}>
            <boxGeometry args={[0.4, 0.02, 0.05]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
      );
    });
  }, [rowsCount, riserWidth, midRow, baseDistanceZ]);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows="percentage"
        camera={{ position: [0, isImax ? 9.5 : 8.5, isImax ? 17 : 14.5], fov: isImax ? 58 : 52, near: 0.1, far: 70 }}
        gl={{ antialias: true }}
      >
        {/* Fondo oscuro del proyecto */}
        <color attach="background" args={['#08060d']} />
        {/* Niebla atmosférica del teatro */}
        <fog attach="fog" args={['#08060d', 20, 42]} />

        {/* Control de cámara (orbital / seat) apuntando con precisión al centro de la pantalla */}
        <CinemaCamera3D
          mode={cameraMode}
          selectedSeat={activeSeatForCamera}
          screenTarget={[0, screenCenterY, screenCenterZ]}
          isImax={isImax}
        />

        {/* Envolver recursos pesados en un Suspense para mostrar spinner */}
        <Suspense fallback={<Loader3D />}>
          {/* Iluminación de la sala */}
          <CinemaLights3D isPlaying={videoPlaying} dimLights={dimLights} />

          {/* Pantalla de cine proporcional con tráiler dinámico */}
          <CinemaScreen3D videoUrl={videoUrl} isPlaying={videoPlaying} isMuted={videoMuted} isImax={isImax} />

          {/* Grilla interactiva de asientos */}
          <CinemaSeats3D
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={onSeatClick}
          />

          {/* Suelo (alfombra) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
            <planeGeometry args={[roomWidth, roomDepth]} />
            <meshStandardMaterial color="#100c18" roughness={0.9} />
          </mesh>

          {/* Techo */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ceilingHeight, -2]} receiveShadow>
            <planeGeometry args={[roomWidth, roomDepth]} />
            <meshStandardMaterial color="#06040a" roughness={0.9} />
          </mesh>

          {/* Pared frontal (Front Wall que sella la pantalla y evita ver el vacío) */}
          <mesh position={[0, ceilingHeight / 2, frontWallZ]} receiveShadow>
            <boxGeometry args={[roomWidth, ceilingHeight, 0.2]} />
            <meshStandardMaterial color="#08060e" roughness={0.95} />
          </mesh>

          {/* Pared trasera */}
          <mesh position={[0, ceilingHeight / 2, isImax ? 17.5 : 14.5]} receiveShadow>
            <boxGeometry args={[roomWidth, ceilingHeight, 0.2]} />
            <meshStandardMaterial color="#0c0a12" roughness={0.9} />
          </mesh>

          {/* Pared izquierda */}
          <mesh position={[-halfRoomWidth, ceilingHeight / 2, -2]} receiveShadow>
            <boxGeometry args={[0.2, ceilingHeight, roomDepth]} />
            <meshStandardMaterial color="#0e0c15" roughness={0.9} />
          </mesh>

          {/* Pared derecha */}
          <mesh position={[halfRoomWidth, ceilingHeight / 2, -2]} receiveShadow>
            <boxGeometry args={[0.2, ceilingHeight, roomDepth]} />
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

// CinemaLights3D.tsx — Iluminación dinámica de la sala de cine 3D
// Luces atmosféricas, LEDs de pasillo y luz frontal de techo.

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CinemaLightsProps {
  isPlaying: boolean;
  dimLights?: boolean;
}

export const CinemaLights3D: React.FC<CinemaLightsProps> = ({ isPlaying }) => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Luz ambiental permanente en 0.005 (sala a oscuras real como en proyección de cine)
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, 0.005, 0.05);
    }

    // Luz cenital sutil para siluetas de butacas
    if (directionalRef.current) {
      ambientRef.current && (directionalRef.current.intensity = THREE.MathUtils.lerp(directionalRef.current.intensity, 0.04, 0.05));
    }

    // Glow dinámico de la pantalla proyectada iluminando la sala
    if (screenGlowRef.current && isPlaying) {
      const flicker = Math.sin(time * 1.8) * 0.08 + 0.55;
      screenGlowRef.current.intensity = flicker;
    }
  });

  return (
    <>
      {/* Luz ambiental cinemática en penumbra (0.005) */}
      <ambientLight ref={ambientRef} intensity={0.005} color="#e8e0ff" />

      {/* Luz cenital tenue para definición de volumen */}
      <directionalLight
        ref={directionalRef}
        position={[0, 10, 4]}
        intensity={0.04}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        color="#ffffff"
      />

      {/* Glow lateral de la pantalla (proyección en paredes) */}
      <pointLight
        ref={screenGlowRef}
        position={[0, 5, -14]}
        intensity={0.35}
        distance={20}
        decay={1.8}
        color="#c0b8ff"
      />

      {/* Luces LED de los pasillos (yellow-500 del proyecto) */}
      {[-5.6, 5.6].map((x, i) => (
        <group key={i}>
          {[0, 1, 2, 3, 4].map((row) => {
            const zPos = (row - 1.5) * 2.2 + 0.9;
            const yPos = (row + 1) * 0.35 + 0.08;
            return (
              <pointLight
                key={row}
                position={[x, yPos, zPos]}
                intensity={0.18}
                distance={3}
                decay={2}
                color="#eab308"
              />
            );
          })}
        </group>
      ))}
    </>
  );
};

export default CinemaLights3D;

// CinemaLights3D.tsx — Iluminación dinámica de la sala de cine 3D
// Luces atmosféricas, LEDs de pasillo y luz frontal de techo.

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CinemaLightsProps {
  isPlaying: boolean;
}

export const CinemaLights3D: React.FC<CinemaLightsProps> = ({ isPlaying }) => {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Luz ambiental: más oscura cuando la película corre, más brillante cuando está pausada
    if (ambientRef.current) {
      const targetIntensity = isPlaying ? 0.08 : 0.25;
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, targetIntensity, 0.05);
    }

    // Glow lateral sutil de la pantalla (parpadeo lento)
    if (screenGlowRef.current && isPlaying) {
      const flicker = Math.sin(time * 1.8) * 0.08 + 0.38;
      screenGlowRef.current.intensity = flicker;
    }
  });

  return (
    <>
      {/* Luz ambiental general (oscurece la sala cuando reproduce) */}
      <ambientLight ref={ambientRef} intensity={0.12} color="#e8e0ff" />

      {/* Luz cenital principal (ilumina asientos desde arriba) */}
      <directionalLight
        position={[0, 10, 4]}
        intensity={0.55}
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

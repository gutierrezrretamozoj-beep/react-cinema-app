// CinemaCamera3D.tsx — Control de cámara para la sala 3D
// Portado de sala3D-cinema: modo orbital libre (OrbitControls) + vista-de-butaca con mouse-look.

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { SeatData } from '../../data/seatData';

interface CinemaCameraProps {
  mode: 'orbit' | 'seat';
  selectedSeat: SeatData | null;
}

// Mapeo de filas a índice (A=0 → más cerca, F=5 → más lejos)
const ROW_INDICES: Record<string, number> = {
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5,
};

export const CinemaCamera3D: React.FC<CinemaCameraProps> = ({ mode, selectedSeat }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const currentTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, -2));
  const defaultOrbitPosition = useRef<THREE.Vector3>(new THREE.Vector3(0, 8, 14));
  const defaultOrbitTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, -2));
  const isMouseDownRef = useRef(false);

  // Habilita/deshabilita OrbitControls al cambiar de modo
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = mode === 'orbit';
    }
  }, [mode]);

  // Detecta si el usuario está arrastrando (para mouse-look en seat mode)
  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = () => { isMouseDownRef.current = true; };
    const onUp = () => { isMouseDownRef.current = false; };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [gl]);

  useFrame((state) => {
    const targetPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    const { pointer } = state;

    if (mode === 'seat' && selectedSeat) {
      const rIndex = ROW_INDICES[selectedSeat.row] ?? 0;
      // Altura del ojo crece progresivamente para filas traseras (mejor línea de visión)
      const eyeHeight = 0.75 + rIndex * 0.14;

      targetPos.set(
        selectedSeat.position[0],
        selectedSeat.position[1] + eyeHeight,
        selectedSeat.position[2] - 0.15,
      );

      if (isMouseDownRef.current) {
        // Mouse-look al arrastrar
        lookTarget.set(pointer.x * 8.5, 5.16 + pointer.y * 5.4, -15.5);
      } else {
        // Centra la vista en la pantalla cuando no hay arrastre
        lookTarget.set(0, 5.16, -15.5);
      }
    } else {
      if (controlsRef.current && !controlsRef.current.enabled) {
        targetPos.copy(defaultOrbitPosition.current);
        lookTarget.copy(defaultOrbitTarget.current);
      } else {
        return; // OrbitControls maneja la cámara en modo orbital
      }
    }

    camera.position.lerp(targetPos, 0.07);
    currentTarget.current.lerp(lookTarget, 0.07);
    camera.lookAt(currentTarget.current);

    // Re-habilita OrbitControls una vez que la cámara llegó a la posición orbital
    if (mode === 'orbit' && controlsRef.current && !controlsRef.current.enabled) {
      const dist = camera.position.distanceTo(defaultOrbitPosition.current);
      if (dist < 0.1) {
        controlsRef.current.target.copy(defaultOrbitTarget.current);
        controlsRef.current.enabled = true;
      }
    }
  });

  return (
    <>
      {mode === 'orbit' && (
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3}
          maxDistance={22}
          target={[0, 2, -2]}
        />
      )}
    </>
  );
};

export default CinemaCamera3D;

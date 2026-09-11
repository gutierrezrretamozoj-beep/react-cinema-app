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
  screenTarget?: [number, number, number];
  isImax?: boolean;
}

// Mapeo de filas a índice (A=0 → más cerca, H=7 en IMAX)
const ROW_INDICES: Record<string, number> = {
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7,
};

export const CinemaCamera3D: React.FC<CinemaCameraProps> = ({
  mode,
  selectedSeat,
  screenTarget = [0, 5.8, -16.2],
  isImax = false,
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const [screenX, screenY, screenZ] = screenTarget;

  const currentTarget = useRef<THREE.Vector3>(new THREE.Vector3(screenX, screenY * 0.6, screenZ * 0.3));
  const defaultOrbitPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(0, isImax ? 9.5 : 8.5, isImax ? 17 : 14.5)
  );
  const defaultOrbitTarget = useRef<THREE.Vector3>(
    new THREE.Vector3(0, screenY * 0.65, screenZ * 0.2)
  );
  const isMouseDownRef = useRef(false);

  // Actualiza la posición por defecto si cambia isImax
  useEffect(() => {
    defaultOrbitPosition.current.set(0, isImax ? 9.5 : 8.5, isImax ? 17 : 14.5);
    defaultOrbitTarget.current.set(0, screenY * 0.65, screenZ * 0.2);
  }, [isImax, screenY, screenZ]);

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

      // FOV dinámico: En las filas delanteras (A y B) aumentamos el campo de visión (FOV angular)
      // para que el espectador pueda apreciar la pantalla completa sin que quede recortada por los bordes.
      // Fila A: ~80° en IMAX, disminuyendo suavemente hasta 58° en las filas traseras.
      const rowFovBonus = Math.max(0, (6 - rIndex) * 3.5);
      const targetFov = (isImax ? 60 : 54) + rowFovBonus;
      const perspectiveCam = camera as THREE.PerspectiveCamera;
      if (perspectiveCam.fov !== undefined && Math.abs(perspectiveCam.fov - targetFov) > 0.1) {
        perspectiveCam.fov = THREE.MathUtils.lerp(perspectiveCam.fov, targetFov, 0.08);
        perspectiveCam.updateProjectionMatrix();
      }

      if (isMouseDownRef.current) {
        // Mouse-look al arrastrar: permite rotar la cabeza suavemente alrededor de la pantalla
        lookTarget.set(
          screenX + pointer.x * (isImax ? 14 : 9),
          screenY + pointer.y * (isImax ? 8 : 5.5),
          screenZ
        );
      } else {
        // En filas muy delanteras (A, B) y butacas extremas (asientos 1, 2, 9, 10),
        // apuntamos con un leve ángulo compensado hacia el tercio medio de la pantalla
        const seatX = selectedSeat.position[0];
        const lookCompensationX = seatX * 0.25; // Suaviza la inclinación en esquinas
        lookTarget.set(screenX + lookCompensationX, screenY, screenZ);
      }
    } else {
      const defaultFov = isImax ? 58 : 52;
      const perspectiveCam = camera as THREE.PerspectiveCamera;
      if (perspectiveCam.fov !== undefined && Math.abs(perspectiveCam.fov - defaultFov) > 0.1) {
        perspectiveCam.fov = THREE.MathUtils.lerp(perspectiveCam.fov, defaultFov, 0.08);
        perspectiveCam.updateProjectionMatrix();
      }

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

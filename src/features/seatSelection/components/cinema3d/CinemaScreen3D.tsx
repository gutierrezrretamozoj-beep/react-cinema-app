import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const safePlay = (video: HTMLVideoElement) => {
  const promise = video.play();
  if (promise !== undefined) {
    promise.catch((error: Error) => {
      if (error.name !== 'AbortError') {
        console.warn('Playback error:', error);
      }
    });
  }
};

interface CinemaScreenProps {
  videoUrl: string;
  isPlaying: boolean;
  isMuted: boolean;
  isImax?: boolean;
}

export const CinemaScreen3D: React.FC<CinemaScreenProps> = ({ videoUrl, isPlaying, isMuted, isImax = false }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Dimensiones proporcionales: pantalla un 20% más grande en todas las salas
  // Estándar pasa de 15.6 x 8.76 a 18.7 x 10.5
  // IMAX pasa de 22.8 x 13.2 a 27.4 x 15.8
  const screenWidth = isImax ? 27.4 : 18.72;
  const screenHeight = isImax ? 15.84 : 10.51;
  const frameWidth = screenWidth + 0.45;
  const frameHeight = screenHeight + 0.45;
  const screenY = isImax ? 7.6 : 5.8;
  const screenZ = isImax ? -18.2 : -16.2;

  // Setup del elemento de video HTML para el VideoTexture
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);

    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('embed');
    const directVideoUrl = isYouTube 
      ? 'https://res.cloudinary.com/etqkjibw/video/upload/v1787930167/samples/sea-turtle.mp4' 
      : videoUrl;

    const video = document.createElement('video');
    video.src = directVideoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = isMuted;
    video.playsInline = true;
    video.preload = 'auto';
    videoRef.current = video;
    video.load();

    const handleCanPlay = () => setVideoLoaded(true);
    const handleError = () => setVideoError(true);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    video.addEventListener('error', handleError);

    if (video.readyState >= 2) setVideoLoaded(true);

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    setVideoTexture(texture);

    if (isPlaying) safePlay(video);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
      video.src = '';
      texture.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  // Sincroniza play/pause y mute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      safePlay(video);
    } else {
      video.pause();
    }
    video.muted = isMuted;
  }, [isPlaying, isMuted]);

  // Bypass autoplay al primer clic del usuario
  useEffect(() => {
    const handleClick = () => {
      const video = videoRef.current;
      if (video && isPlaying) safePlay(video);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isPlaying]);

  // Actualiza el material cuando el video carga
  useEffect(() => {
    if (materialRef.current) materialRef.current.needsUpdate = true;
  }, [videoLoaded, videoTexture]);

  // Animación de glow pulsante en pantalla
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const showPlaceholder = !videoTexture || !videoLoaded || videoError;

    if (showPlaceholder && materialRef.current) {
      const pulse = Math.sin(time * 2.0) * 0.15 + 0.35;
      if (videoError) {
        materialRef.current.color.setRGB(pulse * 0.8, pulse * 0.1, pulse * 0.1);
      } else {
        // Indigo pulsante mientras carga (compatible con dark theme del proyecto)
        materialRef.current.color.setRGB(pulse * 0.4, pulse * 0.15, pulse * 0.85);
      }
    } else if (materialRef.current) {
      materialRef.current.color.setRGB(1, 1, 1);
    }

    if (lightRef.current && isPlaying && !videoError && videoLoaded) {
      // Parpadeo sutil de la pantalla
      const flicker = Math.sin(time * 3.5) * 0.15 + Math.cos(time * 6.5) * 0.1 + 1.2;
      lightRef.current.intensity = flicker;
      const r = Math.sin(time * 0.5) * 0.12 + 0.88;
      const g = Math.cos(time * 0.3) * 0.1 + 0.9;
      const b = Math.sin(time * 0.7) * 0.12 + 0.9;
      lightRef.current.color.setRGB(r, g, b);
    } else if (lightRef.current) {
      lightRef.current.intensity = 0.3;
      lightRef.current.color.setHex(0xffffff);
    }
  });

  return (
    <group position={[0, screenY, screenZ]}>
      {/* Pantalla principal proporcional */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial
          ref={materialRef}
          map={(videoTexture && videoLoaded && !videoError) ? videoTexture : undefined}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Marco de la pantalla */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshStandardMaterial
          color="#0d0d12"
          roughness={0.95}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soporte inferior */}
      <mesh position={[0, -screenHeight / 2 - 0.4, -0.2]} castShadow>
        <boxGeometry args={[screenWidth * 0.45, 0.6, 0.6]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} />
      </mesh>
      <mesh position={[0, -screenHeight / 4 - 0.5, -0.2]} castShadow>
        <boxGeometry args={[0.36, screenHeight * 0.55, 0.36]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Luz ambiental de la pantalla */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 2.2]}
        distance={isImax ? 38 : 28.8}
        intensity={isImax ? 1.7 : 1.3}
        decay={1.2}
      />
    </group>
  );
};

export default CinemaScreen3D;

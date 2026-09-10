// soundEffects.ts — Efectos de sonido nativos generados por Web Audio API y háptica
// Cero dependencias externas (.mp3), 0 KB de carga de red adicional, sin latencia ni errores 404.

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Inicialización perezosa (lazy) para cumplir con las políticas de autoplay de los navegadores
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cinema_sfx_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinema_sfx_enabled', String(this.enabled));
    }
    return this.enabled;
  }

  // Clic táctil cinemático al seleccionar una butaca
  public playSeatSelect() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate(12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Rampa de frecuencia rápida (sonido 'pop/click' mecánico satisfactorio)
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  }

  // Clic sutil al deseleccionar
  public playSeatDeselect() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate(8);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  // Tono suave de alerta (asiento huérfano / acción bloqueada)
  public playWarning() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.vibrate([20, 50, 20]);

    const now = ctx.currentTime;
    [400, 360].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      gain.gain.setValueAtTime(0.1, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.085);
    });
  }

  // Transición acústica al avanzar de paso
  public playStepTransition() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.09);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.125);
  }

  // Acorde triunfal cinematográfico al confirmar la compra (Paso 5)
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // Do Mayor (C5, E5, G5, C6)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.08, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.48);
    });
  }

  // Háptica segura en navegadores móviles compatibles
  public vibrate(pattern: number | number[]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignorar si no está soportado
    }
  }
}

export const sfx = new SoundEffectsManager();

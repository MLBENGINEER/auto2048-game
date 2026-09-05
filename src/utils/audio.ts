// Web Audio API Procedural Synthesizer for Auto2048
// Completely self-contained, no external mp3 assets needed.

class SoundFX {
  public ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  /**
   * Verdadero mientras YouTube tiene el juego pausado. Sin esta bandera,
   * initCtx() reanudaria el contexto en el siguiente sonido y la pausa no
   * serviria de nada.
   */
  private pausado: boolean = false;

  /**
   * Bus maestro por el que pasa todo el audio.
   *
   * Antes cada oscilador se conectaba directo a ctx.destination, asi que al
   * encadenar fusiones las amplitudes se sumaban sin control y el navegador
   * recortaba la onda: es lo que se oia como un sonido "loco" y sucio. El
   * compresor absorbe esos picos y el gain deja margen de cabecera.
   */
  private bus: GainNode | null = null;

  /** Marcas de tiempo del ultimo disparo de cada sonido, para no solaparlos. */
  private ultimoDisparo: Record<string, number> = {};

  /** Corta todo el sonido en curso. Se usa cuando YouTube pausa el juego. */
  public suspender(): void {
    this.pausado = true;
    try {
      if (this.ctx && this.ctx.state === 'running') {
        void this.ctx.suspend();
      }
    } catch {
      /* si el navegador no deja suspender, no hay nada que hacer */
    }
  }

  /** Devuelve el audio tras una pausa de YouTube. */
  public reanudar(): void {
    this.pausado = false;
    try {
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
    } catch {
      /* idem */
    }
  }

  public getBus(): AudioNode | null {
    const ctx = this.initCtx();
    if (!ctx) return null;
    if (!this.bus) {
      const limitador = ctx.createDynamicsCompressor();
      limitador.threshold.setValueAtTime(-8, ctx.currentTime);
      limitador.knee.setValueAtTime(6, ctx.currentTime);
      limitador.ratio.setValueAtTime(12, ctx.currentTime);
      limitador.attack.setValueAtTime(0.002, ctx.currentTime);
      limitador.release.setValueAtTime(0.15, ctx.currentTime);

      const maestro = ctx.createGain();
      maestro.gain.setValueAtTime(0.7, ctx.currentTime);

      maestro.connect(limitador);
      limitador.connect(ctx.destination);
      this.bus = maestro;
    }
    return this.bus;
  }

  /**
   * Evita que un mismo sonido se vuelva a disparar antes de tiempo. Al
   * encadenar fusiones rapidas se apilaban copias del mismo efecto.
   */
  public puedeSonar(clave: string, separacionMs: number): boolean {
    const ahora = performance.now();
    const previo = this.ultimoDisparo[clave] ?? -Infinity;
    if (ahora - previo < separacionMs) return false;
    this.ultimoDisparo[clave] = ahora;
    return true;
  }

  public initCtx(): AudioContext | null {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && !this.pausado) {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Slide swipe sound (soft whoosh)
  playSlide() {
    if (this.isMuted) return;
    if (!this.puedeSonar('slide', 50)) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const salida = this.getBus();
      if (!salida) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(salida);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio errors if blocked by browser policy
    }
  }

  // Pop / Merge sound: dispatches to appropriate fusion audio
  playMerge(level: number) {
    if (level >= 11) {
      reproducirSonidoHitoLeyenda(level);
    } else {
      reproducirSonidoFusionNormal(level);
    }
  }

  // Vintage horn "Ahooga!" or Engine startup when Level 4 (Model T) is discovered
  playVintageHorn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const salida = this.getBus();
      if (!salida) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);
      osc.frequency.setValueAtTime(320, now + 0.22);
      osc.frequency.linearRampToValueAtTime(140, now + 0.38);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.2, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(salida);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Ignore
    }
  }

  // Board Expansion fanfare
  playBoardExpansion() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const salida = this.getBus();
      if (!salida) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5 major arpeggio

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        const startTime = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(salida);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // Rewarded Ad Continue Sound: Turbo nitro rescue fanfare
  playSalvageReward() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const salida = this.getBus();
      if (!salida) return;

      const now = this.ctx.currentTime;
      const notes = [330, 440, 554.37, 659.25, 880]; // E4, A4, C#5, E5, A5 uplifting fanfare

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        const startTime = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(salida);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  // Game over tone
  playGameOver() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const salida = this.getBus();
      if (!salida) return;

      const now = this.ctx.currentTime;
      const notes = [300, 260, 220, 180];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        const startTime = now + idx * 0.12;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(salida);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundFX();

/**
 * Función independiente para fusiones normales (Niveles 1 al 10).
 * Genera un sonido retroarcade nítido y dinámico según el nivel de la pieza.
 */
export function reproducirSonidoFusionNormal(level: number = 1) {
  if (soundManager.isMuted) return;
  if (!soundManager.puedeSonar('fusion', 60)) return;
  try {
    const ctx = soundManager.initCtx();
    if (!ctx) return;
    const salida = soundManager.getBus();
    if (!salida) return;

    const now = ctx.currentTime;
    const safeLevel = Math.max(1, Math.min(level, 10));
    const baseFreq = 190 + safeLevel * 48;

    // Oscilador 1: Tono principal de fusión retro
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = safeLevel <= 3 ? 'triangle' : 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.55, now + 0.12);

    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc1.connect(gain1);
    gain1.connect(salida);

    osc1.start(now);
    osc1.stop(now + 0.16);

    // Oscilador 2: Destello armónico metálico / chirrido de motor
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2.2, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 3.1, now + 0.1);

    gain2.gain.setValueAtTime(0.06, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc2.connect(gain2);
    gain2.connect(salida);

    osc2.start(now);
    osc2.stop(now + 0.12);
  } catch (err) {
    console.debug('Error en reproducirSonidoFusionNormal:', err);
  }
}

/**
 * Función independiente para fusiones de Hito Legendario (Nivel 11 en adelante).
 * Genera un sonido épico, expansivo, polifónico y festivo de videojuego legendario
 * usando múltiples osciladores nativos de la API de Audio de HTML5.
 */
export function reproducirSonidoHitoLeyenda(level: number = 11) {
  if (soundManager.isMuted) return;
  // Dura cerca de un segundo y usa once osciladores: solaparlo consigo mismo
  // es lo que mas ensuciaba el sonido.
  if (!soundManager.puedeSonar('hito', 500)) return;
  try {
    const ctx = soundManager.initCtx();
    if (!ctx) return;
    const salida = soundManager.getBus();
    if (!salida) return;

    const now = ctx.currentTime;

    // 1. IMPACTO SUB-BASS EXPANSIVO (Rugido sónico de aceleración legendaria)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.45);

    subGain.gain.setValueAtTime(0.25, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    subOsc.connect(subGain);
    subGain.connect(salida);

    subOsc.start(now);
    subOsc.stop(now + 0.5);

    // 2. ARPEGIO TRIUNFAL ASCENDENTE (Notas mayores épicas: C4, E4, G4, B4, C5, E5, G5, C6)
    // Se ajustan armónicos según si es nivel 11 (Superdeportivo), 12, 13 o 14 (Nave Espacial)
    const basePitch = level >= 14 ? 330 : level >= 13 ? 293.66 : 261.63; // C4 o E4 base
    const intervals = [1, 1.25, 1.5, 1.875, 2, 2.5, 3, 4]; // Acorde mayor con séptima y octavas

    intervals.forEach((multiplier, index) => {
      const startTime = now + index * 0.055;
      const freq = basePitch * multiplier;

      // Onda cuadrada / diente de sierra filtrada con timbre retroarcade
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = index % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, startTime + 0.28);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, startTime);
      filter.frequency.exponentialRampToValueAtTime(1200, startTime + 0.4);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(salida);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });

    // 3. CAMPANAS DE BRILLO CÓSMICO (Fuegos artificiales de audio / Shimmer)
    const shimmerDelay = now + 0.45;
    const shimmerPitches = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7

    shimmerPitches.forEach((freq, idx) => {
      const sOsc = ctx.createOscillator();
      const sGain = ctx.createGain();
      const time = shimmerDelay + idx * 0.08;

      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(freq, time);
      sOsc.frequency.linearRampToValueAtTime(freq * 1.05, time + 0.35);

      sGain.gain.setValueAtTime(0.1, time);
      sGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      sOsc.connect(sGain);
      sGain.connect(salida);

      sOsc.start(time);
      sOsc.stop(time + 0.4);
    });

    // 4. ACORDE SUSTENTADO DE GLORIA (Resonancia expansiva final)
    const chordTime = now + 0.35;
    [basePitch * 2, basePitch * 2.5, basePitch * 3].forEach((f) => {
      const chordOsc = ctx.createOscillator();
      const chordGain = ctx.createGain();
      chordOsc.type = 'triangle';
      chordOsc.frequency.setValueAtTime(f, chordTime);

      chordGain.gain.setValueAtTime(0.08, chordTime);
      chordGain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.85);

      chordOsc.connect(chordGain);
      chordGain.connect(salida);

      chordOsc.start(chordTime);
      chordOsc.stop(chordTime + 0.85);
    });
  } catch (err) {
    console.debug('Error en reproducirSonidoHitoLeyenda:', err);
  }
}

// Registro global para compatibilidad con llamadas JavaScript directas
if (typeof window !== 'undefined') {
  (window as unknown as { reproducirSonidoFusionNormal: typeof reproducirSonidoFusionNormal }).reproducirSonidoFusionNormal = reproducirSonidoFusionNormal;
  (window as unknown as { reproducirSonidoHitoLeyenda: typeof reproducirSonidoHitoLeyenda }).reproducirSonidoHitoLeyenda = reproducirSonidoHitoLeyenda;
}

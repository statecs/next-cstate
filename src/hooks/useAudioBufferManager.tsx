import { useState, useRef, useCallback } from 'react';

const SAMPLE_RATE = 24000;

// A little headroom before the first chunk starts so the next ones arrive in
// time to be queued behind it; otherwise the opening of every answer stutters.
const INITIAL_LATENCY = 0.08;

/**
 * Plays a stream of PCM chunks gaplessly by scheduling each one right after the
 * previous on the AudioContext clock, rather than waiting for `onended` and
 * starting the next — which left an audible gap per chunk and, worse, flipped
 * "playing" off between chunks so mic echo leaked to the server mid-answer.
 */
class AudioBufferManager {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private levelBuf: Float32Array;
  private sources = new Set<AudioBufferSourceNode>();
  private nextStart = 0;
  private generation = 0;
  private playing = false;
  onStart: (() => void) | null = null;
  onComplete: (() => void) | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.connect(audioContext.destination);
    this.levelBuf = new Float32Array(this.analyser.fftSize);
  }

  get isPlaying() {
    return this.playing;
  }

  /** RMS of what is currently coming out of the speakers, 0..~1. */
  level(): number {
    if (!this.playing) return 0;
    this.analyser.getFloatTimeDomainData(this.levelBuf);
    let sum = 0;
    for (let i = 0; i < this.levelBuf.length; i++) sum += this.levelBuf[i] * this.levelBuf[i];
    return Math.sqrt(sum / this.levelBuf.length);
  }

  addChunk(chunk: Float32Array) {
    const ctx = this.audioContext;
    if (ctx.state === 'suspended') {
      // Don't await — scheduling against the clock still works once it resumes.
      ctx.resume().catch(() => {});
    }

    const buffer = ctx.createBuffer(1, chunk.length, ctx.sampleRate);
    buffer.copyToChannel(chunk, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.analyser);

    const now = ctx.currentTime;
    if (!this.playing) {
      this.playing = true;
      this.nextStart = now + INITIAL_LATENCY;
      this.onStart?.();
    } else if (this.nextStart < now) {
      // The network fell behind the clock; resume from now instead of trying
      // to catch up (which would play the backlog on top of itself).
      this.nextStart = now;
    }

    const gen = this.generation;
    this.sources.add(source);
    source.onended = () => {
      source.disconnect();
      this.sources.delete(source);
      if (gen !== this.generation) return;
      if (this.sources.size === 0) {
        this.playing = false;
        this.onComplete?.();
      }
    };
    source.start(this.nextStart);
    this.nextStart += buffer.duration;
  }

  stop() {
    this.generation++;
    this.sources.forEach(s => {
      try { s.stop(); } catch { /* already ended */ }
      s.disconnect();
    });
    this.sources.clear();
    this.nextStart = 0;
    this.playing = false;
  }

  close() {
    this.stop();
    this.analyser.disconnect();
  }
}

export const useAudioBufferManager = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const playbackStartedAtRef = useRef(0);
  const playbackEndedAtRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const managerRef = useRef<AudioBufferManager | null>(null);
  const onStartRef = useRef<(() => void) | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const ensureManager = useCallback(() => {
    if (!audioContextRef.current) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new Ctor({ sampleRate: SAMPLE_RATE });
    }
    if (!managerRef.current) {
      const m = new AudioBufferManager(audioContextRef.current);
      m.onStart = () => {
        playbackStartedAtRef.current = Date.now();
        isPlayingRef.current = true;
        setIsPlaying(true);
        onStartRef.current?.();
      };
      m.onComplete = () => {
        playbackEndedAtRef.current = Date.now();
        isPlayingRef.current = false;
        setIsPlaying(false);
        onCompleteRef.current?.();
      };
      managerRef.current = m;
    }
    return managerRef.current;
  }, []);

  const addAudioChunk = useCallback((chunk: Float32Array) => {
    ensureManager().addChunk(chunk);
  }, [ensureManager]);

  const stopAudio = useCallback(() => {
    managerRef.current?.stop();
    if (isPlayingRef.current) playbackEndedAtRef.current = Date.now();
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  /** Tear the playback context down entirely — for the end of a session. */
  const closeAudio = useCallback(() => {
    managerRef.current?.close();
    managerRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  const getOutputLevel = useCallback(() => managerRef.current?.level() ?? 0, []);

  const setOnPlaybackStart = useCallback((cb: (() => void) | null) => {
    onStartRef.current = cb;
  }, []);

  const setOnPlaybackComplete = useCallback((cb: (() => void) | null) => {
    onCompleteRef.current = cb;
  }, []);

  return {
    isPlaying,
    isPlayingRef,
    playbackStartedAtRef,
    playbackEndedAtRef,
    addAudioChunk,
    stopAudio,
    closeAudio,
    getOutputLevel,
    setOnPlaybackStart,
    setOnPlaybackComplete,
  };
};

import { makeAutoObservable } from 'mobx';
import { useState, useRef, useCallback } from 'react';

class AudioBufferManager {
  private audioQueue: Int16Array[] = [];
  private isPlaying: boolean = false;
  private pitchFactor: number = 1.0;
  private audioContext: AudioContext;
  private noiseGateThreshold: number = 0.01;
  private smoothingFactor: number = 0.2;
  private onPlaybackComplete: (() => void) | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    makeAutoObservable(this);
  }

  setPitchFactor(factor: number) {
    this.pitchFactor = factor;
  }

  setNoiseGateThreshold(threshold: number) {
    this.noiseGateThreshold = threshold;
  }

  setOnPlaybackComplete(callback: () => void) {
    this.onPlaybackComplete = callback;
    this.isPlaying = false;
  }

  addAudioChunk(chunk: Int16Array) {
    this.audioQueue.push(chunk);
    this.playNext();
  }

  private async playNext() {
    if (this.isPlaying || this.audioQueue.length === 0) return;
    this.isPlaying = true;
    const audioData = this.audioQueue.shift()!;
    await this.playAudio(audioData);
    this.isPlaying = false;
    if (this.audioQueue.length === 0 && this.onPlaybackComplete) {
      this.onPlaybackComplete();
    } else {
      this.playNext();
    }
  }

  private playAudio(audioBuffer: Int16Array): Promise<void> {
    return new Promise((resolve) => {
      // Convert Int16Array to Float32Array
      const float32Array = new Float32Array(audioBuffer.length);
      for (let i = 0; i < audioBuffer.length; i++) {
        float32Array[i] = audioBuffer[i] / 0x7FFF; // Normalize to -1.0 to 1.0
      }

      // Apply noise gate
      this.applyNoiseGate(float32Array);

      // Create an AudioBuffer
      const audioBufferObj = this.audioContext.createBuffer(1, float32Array.length, this.audioContext.sampleRate);
      audioBufferObj.copyToChannel(float32Array, 0);

      // Create a BufferSource to play the audio
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBufferObj;
      source.playbackRate.value = this.pitchFactor;
      source.connect(this.audioContext.destination);
      source.onended = () => {
        resolve();
      };
      source.start(0);
    });
  }

  private applyNoiseGate(buffer: Float32Array) {
    let prevSample = 0;
    for (let i = 0; i < buffer.length; i++) {
      const absSample = Math.abs(buffer[i]);
      if (absSample < this.noiseGateThreshold) {
        // Apply smoothing to reduce abrupt transitions
        buffer[i] = buffer[i] * (1 - this.smoothingFactor) + prevSample * this.smoothingFactor;
      }
      prevSample = buffer[i];
    }
  }

  reset() {
    this.audioQueue = [];
    this.isPlaying = false;
  }
}

export const useAudioBufferManager = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitchFactor, setPitchFactor] = useState(1.0);
  const [noiseGateThreshold, setNoiseGateThreshold] = useState(0.01);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferManagerRef = useRef<AudioBufferManager | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!bufferManagerRef.current) {
      bufferManagerRef.current = new AudioBufferManager(audioContextRef.current);
    }
  }, []);

  const addAudioChunk = useCallback((chunk: Int16Array) => {
    if (!bufferManagerRef.current) {
      initializeAudio();
    }
    bufferManagerRef.current!.addAudioChunk(chunk);
    setIsPlaying(true);
  }, [initializeAudio]);

  const stopAudio = useCallback(() => {
    if (bufferManagerRef.current) {
      bufferManagerRef.current.reset();
    }
    setIsPlaying(false);
  }, []);

  const adjustPitch = useCallback((factor: number) => {
    setPitchFactor(factor);
    if (bufferManagerRef.current) {
      bufferManagerRef.current.setPitchFactor(factor);
    }
  }, []);

  const adjustNoiseGate = useCallback((threshold: number) => {
    setNoiseGateThreshold(threshold);
    if (bufferManagerRef.current) {
      bufferManagerRef.current.setNoiseGateThreshold(threshold);
    }
  }, []);

  const setOnPlaybackComplete = useCallback((callback: () => void) => {
    if (bufferManagerRef.current) {
      bufferManagerRef.current.setOnPlaybackComplete(callback);
    }
  }, []);

  return { 
    isPlaying, 
    addAudioChunk, 
    stopAudio, 
    pitchFactor, 
    adjustPitch, 
    noiseGateThreshold, 
    adjustNoiseGate,
    setOnPlaybackComplete
  };
};
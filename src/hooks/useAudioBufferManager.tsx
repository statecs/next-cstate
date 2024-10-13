import { makeAutoObservable } from 'mobx';
import { useState, useRef, useCallback } from 'react';

class AudioBufferManager {
  private audioQueue: Float32Array[] = [];
  private isPlaying: boolean = false;
  private audioContext: AudioContext;
  private onPlaybackComplete: (() => void) | null = null;
  private currentSource: AudioBufferSourceNode | null = null; // Keep track of the current audio source

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    makeAutoObservable(this);
  }

  setOnPlaybackComplete(callback: () => void) {
    this.onPlaybackComplete = callback;
    this.isPlaying = false;
  }

  addAudioChunk(chunk: Float32Array) {
    // Stop the currently playing audio if a new chunk arrives
    if (this.currentSource) {
      this.currentSource.stop(); // Stop the current audio source
      this.currentSource = null; // Clear reference to the current source
    }

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

  private playAudio(audioBuffer: Float32Array): Promise<void> {
    return new Promise((resolve) => {
      const audioBufferObj = this.audioContext.createBuffer(1, audioBuffer.length, this.audioContext.sampleRate);
      audioBufferObj.copyToChannel(audioBuffer, 0);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBufferObj;
      source.connect(this.audioContext.destination);

      this.currentSource = source; // Keep track of the current playing source

      source.onended = () => {
        resolve();
      };
      source.start(0);
    });
  }

  reset() {
    this.audioQueue = [];
    this.isPlaying = false;

      // Stop the current audio if it's playing
      if (this.currentSource) {
        this.currentSource.stop();
        this.currentSource = null;
      }
    }
  }

  export const useAudioBufferManager = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const bufferManagerRef = useRef<AudioBufferManager | null>(null);
  
    const initializeAudio = useCallback(() => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (!bufferManagerRef.current) {
        bufferManagerRef.current = new AudioBufferManager(audioContextRef.current);
      }
    }, []);
  
    const addAudioChunk = useCallback((chunk: Float32Array) => {
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
  
    const setOnPlaybackComplete = useCallback((callback: () => void) => {
      if (bufferManagerRef.current) {
        bufferManagerRef.current.setOnPlaybackComplete(callback);
      }
    }, []);
  
    return { 
      isPlaying, 
      addAudioChunk, 
      stopAudio, 
      setOnPlaybackComplete
    };
  };
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { ExtendedRecipe } from '../types';

interface AudioContextType {
  currentRecipe: ExtendedRecipe | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playRecipe: (recipe: ExtendedRecipe, audioUrl: string) => Promise<void>;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentRecipe, setCurrentRecipe] = useState<ExtendedRecipe | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const startTimeUpdates = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateTime, 1000);
  };

  const stopTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playRecipe = async (recipe: ExtendedRecipe, audioUrl: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        stopTimeUpdates();
      }

      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.volume = volume;
      audioRef.current = audio;

      // Set up event listeners
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
        stopTimeUpdates();
        setCurrentRecipe(null);
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        console.error('Error loading audio');
      };

      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        let isResolved = false;

        audio.oncanplaythrough = () => {
          if (!isResolved) {
            isResolved = true;
            resolve();
          }
        };

        audio.onerror = () => {
          if (!isResolved) {
            isResolved = true;
            reject(new Error('Error loading audio'));
          }
        };

        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            reject(new Error('Audio loading timeout'));
          }
        }, 20000);
      });

      // Start playing
      await audio.play();
      setCurrentRecipe(recipe);
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);
      startTimeUpdates();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
      throw error;
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      stopTimeUpdates();
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      startTimeUpdates();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
      setCurrentRecipe(null);
      stopTimeUpdates();
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const value: AudioContextType = {
    currentRecipe,
    isPlaying,
    isPaused,
    isLoading,
    currentTime,
    duration,
    volume,
    playRecipe,
    pauseAudio,
    resumeAudio,
    stopAudio,
    setVolume,
    seekTo,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
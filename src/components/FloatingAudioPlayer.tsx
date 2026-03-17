import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import FloatingWidget from './FloatingWidget';

const FloatingAudioPlayer: React.FC = () => {
  const {
    currentRecipe,
    isPlaying,
    isPaused,
    isLoading,
    currentTime,
    duration,
    volume,
    pauseAudio,
    resumeAudio,
    stopAudio,
    setVolume,
    seekTo,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Don't render if no recipe is loaded
  if (!currentRecipe && !isLoading) {
    return null;
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (isPaused) {
      resumeAudio();
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <FloatingWidget
      storageKey="floating-audio"
      defaultPos={{ x: 16, y: 16 }}
      defaultSize={{ width: 420, height: 180 }}
      minWidth={340}
      minHeight={160}
      className="bg-minimalist-slate text-minimalist-sand rounded-2xl shadow-soft border border-minimalist-blue/40"
      header={
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            {currentRecipe?.imgLink ? (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-minimalist-blue/30 flex-shrink-0">
                <Image
                  src={currentRecipe.imgLink}
                  alt={currentRecipe.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-minimalist-blue/30 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {isLoading ? 'Loading audio…' : currentRecipe?.name}
              </div>
              <div className="text-xs text-minimalist-sand/70 truncate">Audio player</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full text-minimalist-sand/80 hover:text-minimalist-sand transition-colors"
            aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
          >
            {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
          </button>
        </div>
      }
    >
      <div className="px-3 pb-1">
        {/* Transport */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="h-10 w-10 rounded-full bg-minimalist-sand text-minimalist-slate flex items-center justify-center"
            disabled={isLoading}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 ml-0.5" />}
          </button>
          <button
            onClick={stopAudio}
            className="h-10 w-10 rounded-full bg-minimalist-blue/30 text-minimalist-sand flex items-center justify-center"
            aria-label="Stop"
          >
            <StopIcon className="h-4 w-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div
              className="w-full h-2 bg-minimalist-blue/30 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-minimalist-sand rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-minimalist-sand/70 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Expanded controls */}
        {isExpanded && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="h-9 w-9 rounded-full bg-minimalist-blue/30 flex items-center justify-center"
              aria-label="Volume"
            >
              {volume === 0 ? (
                <SpeakerXMarkIcon className="h-4 w-4" />
              ) : (
                <SpeakerWaveIcon className="h-4 w-4" />
              )}
            </button>
            {showVolumeSlider && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1"
              />
            )}
            <span className="text-[11px] text-minimalist-sand/70 w-10 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}
      </div>
    </FloatingWidget>
  );
};

export default FloatingAudioPlayer;
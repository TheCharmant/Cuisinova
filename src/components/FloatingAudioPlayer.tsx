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
    <div className="fixed bottom-4 right-4 z-floating bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-peach-200 overflow-hidden transition-all duration-300 kawaii-card">
      {/* Compact View */}
      <div className="flex items-center p-3 gap-3 min-w-[280px]">
        {/* Recipe Image */}
        {currentRecipe?.imgLink && (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-peach-200 shadow-pastel flex-shrink-0">
            <Image
              src={currentRecipe.imgLink}
              alt={currentRecipe.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-xl"
            />
          </div>
        )}

        {/* Recipe Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-brand-700 truncate">
            {isLoading ? 'Loading audio...' : currentRecipe?.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {isLoading ? 'Please wait...' : 'Recipe Audio'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isLoading && (
            <>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-peach-300 to-violet-300 hover:from-peach-400 hover:to-violet-400 flex items-center justify-center shadow-pastel hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={stopAudio}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center shadow-pastel transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <StopIcon className="w-4 h-4 text-red-600" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-pastel transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </>
          )}

          {isLoading && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-peach-300 to-violet-300 flex items-center justify-center shadow-pastel">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && !isLoading && (
        <div className="px-3 pb-3 border-t border-peach-100">
          {/* Progress Bar */}
          <div className="mb-3">
            <div
              className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-peach-400 to-violet-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-pastel transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {volume === 0 ? (
                <SpeakerXMarkIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <SpeakerWaveIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f9a8d4 0%, #c084fc ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            )}

            <span className="text-xs text-gray-500 min-w-[3rem] text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAudioPlayer;
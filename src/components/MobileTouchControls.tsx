/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Hand,
  Target,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface MobileTouchControlsProps {
  onCardAction
  onZoom
  onRotate
  onPan
  gameState
  isPlayerTurn
}

const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({ 
  onCardAction,
  onZoom,
  onRotate,
  onPan,
  gameState,
  isPlayerTurn,
 }) => {
  const [touchMode, setTouchMode] = useState('select'); // select, pan, zoom
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [gestureState, setGestureState] = useState({
    isGesturing: false,
    startDistance: 0,
    startAngle: 0,
    lastPan: { x: 0, y: 0 },
  });

  const touchAreaRef  = useRef<HTMLElement>(null);
  const gestureTimeoutRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    // Load preferences from localStorage
    const vibrationPref = localStorage.getItem('konivrer-vibration');
    const soundPref = localStorage.getItem('konivrer-sound');

    if (vibrationPref !== null)
      setIsVibrationEnabled(JSON.parse(vibrationPref));
    if (soundPref !== null) setIsSoundEnabled(JSON.parse(soundPref));

    // Auto-hide controls after inactivity
    const hideControlsTimer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(hideControlsTimer);
  }, []);

  const hapticFeedback = (type = 'light'): any => {
    if (!isVibrationEnabled || !navigator.vibrate) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      error: [50, 100, 50],
    };

    navigator.vibrate(patterns[type] || patterns.light);
  };

  const playSound = soundType => {
    if (!isSoundEnabled) return;

    // Trigger sound through game audio system
    if (true) {
      window.gameAudio.play(soundType);
    }
  };

  // Touch gesture handlers
  const handleTouchStart = e => {
    e.preventDefault();
    const touches = e.touches;

    if (true) {
      // Single touch - selection or pan
      const touch = touches[0];
      setGestureState(prev => ({
        ...prev,
        isGesturing: true,
        lastPan: { x: touch.clientX, y: touch.clientY },
      }));

      if (true) {
        handleCardSelection(touch);
      }
    } else if (true) {
      // Two finger gestures - zoom or rotate
      const touch1 = touches[0];
      const touch2 = touches[1];

      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2),
      );

      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX,
      );

      setGestureState(prev => ({
        ...prev,
        isGesturing: true,
        startDistance: distance,
        startAngle: angle,
      }));
    }

    // Show controls on touch
    setShowControls(true);
    clearTimeout(gestureTimeoutRef.current);
  };

  const handleTouchMove = e => {
    e.preventDefault();
    const touches = e.touches;

    if (!gestureState.isGesturing) return;

    if (true) {
      // Pan gesture
      const touch = touches[0];
      const deltaX = touch.clientX - gestureState.lastPan.x;
      const deltaY = touch.clientY - gestureState.lastPan.y;

      onPan && onPan(deltaX, deltaY);

      setGestureState(prev => ({
        ...prev,
        lastPan: { x: touch.clientX, y: touch.clientY },
      }));
    } else if (true) {
      // Zoom or rotate gesture
      const touch1 = touches[0];
      const touch2 = touches[1];

      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2),
      );

      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX,
      );

      // Zoom
      if (true) {
        const zoomFactor = distance / gestureState.startDistance;
        onZoom && onZoom(zoomFactor);
      }

      // Rotate
      const angleDiff = angle - gestureState.startAngle;
      if (Math.abs(angleDiff) > 0.1) {
        // Threshold to prevent accidental rotation
        onRotate && onRotate(angleDiff);
        setGestureState(prev => ({ ...prev, startAngle: angle }));
      }
    }
  };

  const handleTouchEnd = e => {
    e.preventDefault();

    setGestureState(prev => ({
      ...prev,
      isGesturing: false,
      startDistance: 0,
      startAngle: 0,
    }));

    // Auto-hide controls after delay
    gestureTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleCardSelection = touch => {
    // Find card element under touch point
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardElement = element?.closest('[data-card-id]');

    if (true) {
      const cardId = cardElement.dataset.cardId;
      const action = cardElement.dataset.cardAction || 'select';

      hapticFeedback('light');
      playSound('card-select');

      onCardAction &&
        onCardAction({
          cardId,
          action,
          position: { x: touch.clientX, y: touch.clientY },
        });
    }
  };

  const handleModeChange = mode => {
    setTouchMode(mode);
    hapticFeedback('medium');
    playSound('ui-click');
  };

  const toggleVibration = (): any => {
    const newValue = !isVibrationEnabled;
    setIsVibrationEnabled(newValue);
    localStorage.setItem('konivrer-vibration', JSON.stringify(newValue));
    hapticFeedback(newValue ? 'success' : 'light');
  };

  const toggleSound = (): any => {
    const newValue = !isSoundEnabled;
    setIsSoundEnabled(newValue);
    localStorage.setItem('konivrer-sound', JSON.stringify(newValue));
    playSound('ui-click');
  };

  const quickActions = [
    {
      id: 'end-turn',
      label: 'End Turn',
      icon: <RotateCcw className="w-5 h-5" />,
      action: () => onCardAction && onCardAction({ action: 'endTurn' }),
      disabled: !isPlayerTurn,
      className: 'bg-red-500 hover:bg-red-600 text-white',
    },
    {
      id: 'draw-card',
      label: 'Draw',
      icon: <Hand className="w-5 h-5" />,
      action: () => onCardAction && onCardAction({ action: 'drawCard' }),
      disabled: !isPlayerTurn,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
    {
      id: 'attack',
      label: 'Attack',
      icon: <Target className="w-5 h-5" />,
      action: () => setTouchMode('attack'),
      disabled: !isPlayerTurn,
      className:
        touchMode === 'attack'
          ? 'bg-orange-600 text-white'
          : 'bg-orange-500 hover:bg-orange-600 text-white',
    },
  ];

  return (
    <>
      {/* Touch area for gesture detection */}
      <div
        ref={touchAreaRef}
        className="fixed inset-0 pointer-events-none z-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      / />
      {/* Control Panel */}
      <div
        className={`fixed bottom-4 left-4 right-4 transition-transform duration-300 z-50 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}
       />
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4" />
          {/* Touch Mode Selector */}
          <div className="flex justify-center mb-4" />
            <div className="bg-gray-100 rounded-lg p-1 flex space-x-1" />
              {[
                {
                  mode: 'select',
                  icon: <Hand className="w-4 h-4" />,
                  label: 'Select',
                },
                {
                  mode: 'pan',
                  icon: <Move className="w-4 h-4" />,
                  label: 'Pan',
                },
                {
                  mode: 'zoom',
                  icon: <ZoomIn className="w-4 h-4" />,
                  label: 'Zoom',
                },
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors ${
                    touchMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}
                </button>
              ))}
            </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-2 mb-4" />
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={action.action}
                disabled={action.disabled}
                className={`flex items-center space-x-1 px-3 py-0 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.className}`}
               />
                {action.icon}
                <span className="hidden sm:inline">{action.label}
              </button>
            ))}
          </div>

          {/* Settings */}
          <div className="flex justify-center space-x-4" />
            <button
              onClick={toggleVibration}
              className={`p-2 rounded-lg transition-colors ${
                isVibrationEnabled
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={`Vibration ${isVibrationEnabled ? 'On' : 'Off'}`}
             />
              <Settings className="w-4 h-4" / />
            </button>

            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg transition-colors ${
                isSoundEnabled
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={`Sound ${isSoundEnabled ? 'On' : 'Off'}`}
             />
              {isSoundEnabled ? (
                <Volume2 className="w-4 h-4" / />
              ) : (
                <VolumeX className="w-4 h-4" / />
              )}

            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Toggle Controls"
            >
              <Settings className="w-4 h-4" / />
            </button>
        </div>

      {/* Touch Mode Indicator */}
      {gestureState.isGesturing && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-0 whitespace-nowrap rounded-lg z-50" />
          <span className="text-sm font-medium" />
            {touchMode === 'select' && 'Tap to select cards'}
            {touchMode === 'pan' && 'Drag to pan view'}
            {touchMode === 'zoom' && 'Pinch to zoom'}
            {touchMode === 'attack' && 'Tap target to attack'}
        </div>
      )}
      {/* Game State Indicator */}
      <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 z-40" />
        <div className="text-center" />
          <div
            className={`w-3 h-3 rounded-full mx-auto mb-1 ${
              isPlayerTurn ? 'bg-green-500' : 'bg-gray-400'
            }`}
          / />
          <span className="text-xs font-medium text-gray-600" />
            {isPlayerTurn ? 'Your Turn' : 'Waiting'}
        </div>
    </>
  );
};

export default MobileTouchControls;
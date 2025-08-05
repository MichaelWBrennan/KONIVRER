import { useEffect, useRef, useState } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface TouchGestureState {
  isTouch: boolean;
  isDragging: boolean;
  startPosition: TouchPosition | null;
  currentPosition: TouchPosition | null;
  swipe: SwipeDirection;
}

interface TouchGestureOptions {
  onSwipe?: (direction: SwipeDirection) => void;
  onTap?: (position: TouchPosition) => void;
  onLongPress?: (position: TouchPosition) => void;
  onDragStart?: (position: TouchPosition) => void;
  onDrag?: (position: TouchPosition, delta: TouchPosition) => void;
  onDragEnd?: (position: TouchPosition) => void;
  minSwipeDistance?: number;
  longPressDelay?: number;
  enableSwipe?: boolean;
  enableDrag?: boolean;
  enableLongPress?: boolean;
}

export const useTouchGestures = (options: TouchGestureOptions = {}) => {
  const {
    onSwipe,
    onTap,
    onLongPress,
    onDragStart,
    onDrag,
    onDragEnd,
    minSwipeDistance = 50,
    longPressDelay = 500,
    enableSwipe = true,
    enableDrag = false,
    enableLongPress = false
  } = options;

  const [gestureState, setGestureState] = useState<TouchGestureState>({
    isTouch: false,
    isDragging: false,
    startPosition: null,
    currentPosition: null,
    swipe: { direction: null, distance: 0, velocity: 0 }
  });

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);

  const calculateDistance = (pos1: TouchPosition, pos2: TouchPosition): number => {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  };

  const calculateDirection = (start: TouchPosition, end: TouchPosition): 'left' | 'right' | 'up' | 'down' => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  };

  const getTouchPosition = (event: TouchEvent | MouseEvent): TouchPosition => {
    if ('touches' in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else if ('clientX' in event) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
    return { x: 0, y: 0 };
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleStart = (event: TouchEvent | MouseEvent) => {
    const position = getTouchPosition(event);
    startTimeRef.current = Date.now();
    hasMoved.current = false;

    setGestureState(prev => ({
      ...prev,
      isTouch: true,
      startPosition: position,
      currentPosition: position
    }));

    // Start long press timer
    if (enableLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        if (!hasMoved.current) {
          onLongPress?.(position);
        }
      }, longPressDelay);
    }

    // Prevent default to avoid unwanted behaviors
    if ('touches' in event) {
      event.preventDefault();
    }
  };

  const handleMove = (event: TouchEvent | MouseEvent) => {
    if (!gestureState.startPosition) return;

    const position = getTouchPosition(event);
    const distance = calculateDistance(gestureState.startPosition, position);
    
    // Mark as moved if beyond a small threshold
    if (distance > 10) {
      hasMoved.current = true;
      clearLongPressTimer();
    }

    setGestureState(prev => ({
      ...prev,
      currentPosition: position,
      isDragging: enableDrag && hasMoved.current
    }));

    // Handle drag
    if (enableDrag && hasMoved.current) {
      if (!gestureState.isDragging) {
        onDragStart?.(gestureState.startPosition!);
      }
      
      const delta = {
        x: position.x - gestureState.startPosition.x,
        y: position.y - gestureState.startPosition.y
      };
      
      onDrag?.(position, delta);
    }

    // Prevent scrolling during touch gestures
    if ('touches' in event && hasMoved.current) {
      event.preventDefault();
    }
  };

  const handleEnd = (event: TouchEvent | MouseEvent) => {
    clearLongPressTimer();

    if (!gestureState.startPosition) return;

    const endPosition = gestureState.currentPosition || gestureState.startPosition;
    const distance = calculateDistance(gestureState.startPosition, endPosition);
    const duration = Date.now() - startTimeRef.current;
    const velocity = distance / duration;

    // Handle swipe
    if (enableSwipe && distance >= minSwipeDistance && hasMoved.current) {
      const direction = calculateDirection(gestureState.startPosition, endPosition);
      const swipeData: SwipeDirection = {
        direction,
        distance,
        velocity
      };
      
      setGestureState(prev => ({ ...prev, swipe: swipeData }));
      onSwipe?.(swipeData);
    }
    // Handle tap (if not moved significantly)
    else if (!hasMoved.current && distance < 10) {
      onTap?.(gestureState.startPosition);
    }

    // Handle drag end
    if (gestureState.isDragging) {
      onDragEnd?.(endPosition);
    }

    // Reset state
    setGestureState({
      isTouch: false,
      isDragging: false,
      startPosition: null,
      currentPosition: null,
      swipe: { direction: null, distance: 0, velocity: 0 }
    });
  };

  const handlers = {
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
    onMouseDown: handleStart,
    onMouseMove: gestureState.isTouch ? handleMove : undefined,
    onMouseUp: gestureState.isTouch ? handleEnd : undefined,
    onMouseLeave: gestureState.isTouch ? handleEnd : undefined,
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  return {
    handlers,
    gestureState,
    isTouch: gestureState.isTouch,
    isDragging: gestureState.isDragging,
    currentSwipe: gestureState.swipe
  };
};
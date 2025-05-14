import { useEffect, useRef, useState } from "react";
import { DirectionEnum } from ".";

const initialPosition = "0px";
const initialRotation = "0deg";

export function useDraggable(onAccept: (direction: DirectionEnum) => void, distanceToAccept: number) {
  const [positionX, setPositionX] = useState(initialPosition);
  const [rotation, setRotation] = useState(initialRotation);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateRotation = (distanceX: number) => {
    if (distanceX > 0) {
      return `${Math.min(distanceX * 0.07, 45)}deg`;
    }

    return `${Math.max(distanceX * 0.07, -45)}deg`;
  }

  const buildEndDrag = (initialX: number, abortSignal: AbortController) => {
    return (moveEvent: TouchEvent) => {
      const endX = moveEvent.changedTouches[0].clientX;
      const distance = endX - initialX;
      if (Math.abs(distance) > distanceToAccept) {
        return distance > 0
          ? onAccept(DirectionEnum.RIGHT)
          : onAccept(DirectionEnum.LEFT);
      }

      setPositionX(initialPosition);
      setRotation(initialRotation);
      abortSignal.abort();
    };
  };

  const buildDragging = (initialX: number) => {
    return (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      const actualX = Number(moveEvent.touches[0].clientX.toFixed(0));

      const calculatedRotation = calculateRotation(actualX - initialX);
      setPositionX(`${actualX - initialX}px`);
      setRotation(calculatedRotation);
    };
  };

  function startDrag(moveEvent: TouchEvent) {
    const { clientX: initialX } = moveEvent.touches[0];

    if (!moveEvent?.target) {
      console.error("Failed to start drag");
      return;
    }

    const movementAbortController = new AbortController();
    const movementAbortSignal = movementAbortController.signal;

    const trimmedInitialX = Number(initialX.toFixed(0));
    moveEvent.target.addEventListener(
      "touchend",
      buildEndDrag(
        trimmedInitialX,
        movementAbortController
      ) as EventListenerOrEventListenerObject,
      {
        signal: movementAbortSignal,
        capture: false,
        passive: false,
      }
    );

    moveEvent.target.addEventListener(
      "touchmove",
      buildDragging(trimmedInitialX) as EventListenerOrEventListenerObject,
      {
        signal: movementAbortSignal,
        capture: false,
        passive: false,
      }
    );
  }

  useEffect(() => {
    containerRef.current?.addEventListener("touchstart", startDrag);
  }, [containerRef]);

  return {
    containerRef,
    positionX,
    rotation
  }
}

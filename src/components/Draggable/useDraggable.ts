import { useEffect, useRef } from "react";
import { DirectionEnum } from ".";


const ANIMATION_INTERVAL_MS = 200 // MS = Milliseconds
const ANIMATION_CSS_INTERVAL = '0.2s'
const ROTATE_MULTIPLIER = 0.1

export function useDraggable(onAccept: (direction: DirectionEnum) => void, distanceToAccept: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialXPosition = useRef(0)
  const animationFrameId = useRef<number>(null)

  useEffect(() => {
    if (!containerRef.current) {
      console.warn('Reference is not set yet')
      return
    }

    containerRef.current.addEventListener('touchstart', getInitialPosition)
    containerRef.current.addEventListener('touchmove', updateContainerPosition)
    containerRef.current.addEventListener('touchend', checkFinalTouchPosition)
  }, [containerRef])

  function getInitialPosition(touchEvent: TouchEvent) {
    touchEvent.preventDefault()

    initialXPosition.current = touchEvent.touches[0].clientX
  }

  function resetFrameAnimation() {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
  }

  function updateContainerPosition(touchEvent: TouchEvent) {
    touchEvent.preventDefault()

    if (!containerRef.current) {
      console.error('Missing container - start')
      return
    }

    const actualXPosition = touchEvent.touches[0].clientX
    const containerXPosition = actualXPosition - initialXPosition.current
    const containerRotation = containerXPosition * ROTATE_MULTIPLIER

    resetFrameAnimation()
    animationFrameId.current = requestAnimationFrame(() => {
      if (!containerRef.current) {
        console.error('Missing container - move')
        return
      }

      containerRef.current.style.transform = `translateX(${containerXPosition}px) rotate(${containerRotation}deg)`
    })
  }

  function resetAnimation(direction: DirectionEnum) {
    setTimeout(() => {
      containerRef.current!.style.opacity = '1'
      containerRef.current!.style.transition = ''
      return onAccept(direction)
    }, ANIMATION_INTERVAL_MS);
  }

  function isDistanceAcceptable(finalX: number) {
    return Math.abs(finalX - initialXPosition.current) < distanceToAccept
  }

  function checkFinalTouchPosition(touchEvent: TouchEvent) {
    if (!containerRef.current) {
      console.error('Missing container - end')
      return
    }

    const finalXPosition = touchEvent.changedTouches[0].clientX;
    containerRef.current.style.transition = ANIMATION_CSS_INTERVAL

    if (isDistanceAcceptable(finalXPosition)) {
      resetFrameAnimation()
      containerRef.current.style.transform = 'translateX(0px) rotate(0deg)'

      setTimeout(() => {
        containerRef.current!.style.transition = ''
      }, ANIMATION_INTERVAL_MS);
      return
    }

    if (finalXPosition - initialXPosition.current > 0) {
      containerRef.current.style.opacity = '0'

      return resetAnimation(DirectionEnum.RIGHT)
    }

    containerRef.current.style.opacity = '0'
    return resetAnimation(DirectionEnum.LEFT)
  }

  return {
    containerRef,
  }
}

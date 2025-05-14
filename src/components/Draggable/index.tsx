import { ReactNode } from "react";
import { useDraggable } from "./useDraggable";

export enum DirectionEnum {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
}

type DraggableProps = {
  distanceToAccept: number;
  onAccept: (direction: DirectionEnum) => void;
  children: ReactNode;
  className: string;
};

export function Draggable({
  children,
  className,
  distanceToAccept,
  onAccept,
}: DraggableProps) {
  const { containerRef, rotation, positionX } = useDraggable(
    onAccept,
    distanceToAccept
  );

  return (
    <div
      draggable
      ref={containerRef}
      className={className}
      style={{
        transform: `translateX(${positionX}) rotate(${rotation})`,
      }}
    >
      {children}
    </div>
  );
}

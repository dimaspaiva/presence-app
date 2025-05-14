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
  const { containerRef, rotation, x } = useDraggable(
    onAccept,
    distanceToAccept
  );

  return (
    <div
      draggable
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        marginLeft: x,
        rotate: rotation,
      }}
    >
      {children}
    </div>
  );
}

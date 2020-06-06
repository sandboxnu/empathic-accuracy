import React, { useState, useRef, useEffect } from "react";
import { GridAnswer } from "lib/types";
import Grid from "./Grid";
import { clamp } from "lodash";

function getRelativeClick(e: React.MouseEvent) {
  // e = Mouse click event.
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left; // x position within the element.
  const y = e.clientY - rect.top; // y position within the element.
  return { x, y };
}

/*
function renderTrail(value) {
  const trail = [];

  for (let i = 3; i < 10; i += 2) {
    if (value.length > i) {
      trail.push(
        <div
          className="circle"
          style={{
            top: value[value.length - i].pos.y,
            left: value[value.length - i].pos.x,
            background: `#${i}${i}${i}`,
          }}
        />,
      );
    }
  }
  return trail;
}
*/
export interface ContinuousGridProps {
  label: string;
  onValue: (a: GridAnswer) => void;
  onGridExit: () => void;
  onPlay: () => void;
  paused: boolean;
}

const ContinuousGrid = ({
  label,
  onValue,
  onGridExit,
  onPlay,
  paused,
}: ContinuousGridProps) => {
  const [lastPos, setLastPos] = useState<GridAnswer>({ x: 0.5, y: 0.5 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener(
      "pointerlockchange",
      () => {
        if (
          document.pointerLockElement === gridRef.current ||
          document.mozPointerLockElement === gridRef.current
        ) {
          onPlay();
        } else {
          onGridExit();
        }
      },
      false
    );
  }, [onPlay, onGridExit]);
  return (
    <div
      ref={gridRef}
      onClick={() => {
        gridRef.current?.requestPointerLock();
      }}
      onMouseMove={(e) => {
        if (!paused) {
          const pos = {
            x: clamp(e.movementX / 250 + lastPos.x, 0, 1),
            y: clamp(e.movementY / 250 + lastPos.y, 0, 1),
          };
          setLastPos(pos);
          onValue(pos);
        }
      }}
    >
      <Grid x={lastPos.x} y={lastPos.y} label={label} />
    </div>
  );
};

export default ContinuousGrid;

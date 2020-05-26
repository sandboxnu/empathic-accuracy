import React, { useState } from "react";
import { AnswerSetWithMetadata, GridAnswer } from "lib/types";

function getRelativeClick(e: React.MouseEvent) {
  console.log(e.clientX, e.clientY);
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
  onValue: (a: AnswerSetWithMetadata) => void;
  getVideoPos: () => number;
  onGridExit: () => void;
  onPlay: () => void;
  paused: boolean;
}

const ContinuousGrid = ({
  onValue,
  getVideoPos,
  onGridExit,
  onPlay,
  paused,
}: ContinuousGridProps) => {
  const [lastPos, setLastPos] = useState<GridAnswer | null>();
  return (
    <div
      className="grid"
      // ! why does it pause on enter instead of exit??
      onMouseLeave={onGridExit}
      onMouseMoveCapture={(e) => {
        const pos = getRelativeClick(e);
        setLastPos(pos);
        if (!paused) {
          onValue({ 0: pos, timestamp: getVideoPos() });
        }
      }}
    >
      <div className="CircleContainer">
        {paused ? (
          <div
            className="circle"
            onClick={onPlay}
            style={{
              background: "green",
              top: "180px",
              left: "200px",
            }}
          />
        ) : (
          <div>
            {lastPos && (
              <div
                className="circle"
                style={{
                  top: lastPos.y,
                  left: lastPos.x,
                }}
              />
            )}
          </div>
        )}
      </div>
      <img id="grid" src="/affect.png" alt="Grid" />
    </div>
  );
};

export default ContinuousGrid;

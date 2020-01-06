/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import grid from './affect.png';

// const startTime = new Date().getTime();

function getRelativeClick(e) {
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

const ContinuousGrid = ({
  values = [], addValue, videoPos, onGridExit, onPlay, paused,
}) => (
  <div
    className="grid"
    // ! why does it pause on enter instead of exit??
    onMouseLeave={onGridExit}
    onMouseMoveCapture={(e) => {
      if (!paused) {
        addValue({ pos: getRelativeClick(e), time: videoPos });
      }
    }}
  >
    <div className="CircleContainer">
      {paused ? (
        <div
          className="circle"
          onClick={onPlay}
          style={{
            background: 'green',
            top: '180px',
            left: '200px',
          }}
        />
      ) : (
        <div>
          {values.length > 0 ? (
            <div
              className="circle"
              style={{
                top: values[values.length - 1].pos.y,
                left: values[values.length - 1].pos.x,
              }}
            />
          ) : null}
        </div>
      )}
    </div>
    <img id="grid" src={grid} alt="Grid" />
  </div>
);

export default ContinuousGrid;

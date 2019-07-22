/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { asField } from 'informed';
import { gridQuestionType } from '../types';
import grid from './affect.png';

const startTime = new Date().getTime();

function getRelativeClick(e) {
  // console.log(e.clientX, e.clientY);
  // e = Mouse click event.
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left; // x position within the element.
  const y = e.clientY - rect.top; // y position within the element.
  return { x, y };
}

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
            background: `#${i}${i}${i}`
          }}
        />
      );
    }
  }
  return trail;
}

// Make GridQuestion play nice with the informed library
// https://joepuzzo.github.io/informed/?selectedKind=CustomInputs&selectedStory=Creating Custom Inputs
const ContinuousGrid = asField(({ fieldState, fieldApi, ...props }) => {
  const { videoPos, onGridExit, onPlay, paused } = props;
  const { value = [] } = fieldState;
  const { setValue } = fieldApi;
  return (
    <div
      className="grid"
      onMouseLeave={onGridExit}
      onMouseMoveCapture={e => {
        console.log(value.length);
        if (!paused) {
          setValue([...value, { pos: getRelativeClick(e), time: videoPos }]);
        }
      }}
    >
      <div className="CircleContainer">
        {paused ? (
          <div
            className="circle pauseCircle"
            onClick={onPlay}
            style={{
              background: 'green',
              top: '180px',
              left: '200px'
            }}
          />
        ) : (
          <div>
            {renderTrail(value)}
            {value.length > 0 ? (
              <div
                className="circle"
                style={{
                  top: value[value.length - 1].pos.y,
                  left: value[value.length - 1].pos.x
                }}
              />
            ) : null}
          </div>
        )}
      </div>
      <img id="grid" src={grid} alt="Grid" />
    </div>
  );
});

ContinuousGrid.propTypes = gridQuestionType;

export default ContinuousGrid;

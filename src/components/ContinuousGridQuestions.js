/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { asField } from "informed";
import { gridQuestionType } from "../types";
import grid from "./affect.png";

const startTime = new Date().getTime();

function getRelativeClick(e) {
  // e = Mouse click event.
  const rect = e.target.getBoundingClientRect();
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
  const { videoPos, onGridExit } = props;
  const { value = [] } = fieldState;
  const { setValue } = fieldApi;
  return (
    <div className="grid">
      <div className="CircleContainer">
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
      <img
        // ! why does it pause on enter instead of exit??
        onMouseLeave={onGridExit}
        onMouseMove={e => {
          setValue([...value, { pos: getRelativeClick(e), time: videoPos }]);
        }}
        id="grid"
        src={grid}
        alt="Grid"
      />
    </div>
  );
});

ContinuousGrid.propTypes = gridQuestionType;

export default ContinuousGrid;

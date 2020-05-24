import React from "react";
import { asField } from "informed";
import { gridQuestionType } from "../types";

function getRelativeClick(e) {
  // e = Mouse click event.
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left; // x position within the element.
  const y = e.clientY - rect.top; // y position within the element.
  return { x, y };
}

// Make GridQuestion play nice with the informed library
// https://joepuzzo.github.io/informed/?selectedKind=CustomInputs&selectedStory=Creating Custom Inputs
const GridQuestion = asField(({ fieldState, fieldApi, ...props }) => {
  const { value = {} } = fieldState;
  const { setValue } = fieldApi;
  return (
    <div className="grid">
      <div className="CircleContainer">
        {value ? (
          <div className="circle" style={{ top: value.y, left: value.x }} />
        ) : null}
      </div>
      <img
        onClick={(e) => setValue(getRelativeClick(e))}
        src="/affect.png"
        alt="Grid"
      />
    </div>
  );
});

GridQuestion.propTypes = gridQuestionType;

export default GridQuestion;

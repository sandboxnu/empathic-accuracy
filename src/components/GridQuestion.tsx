import React from "react";
import { useField } from "informed";
import { gridQuestionType } from "../types";
import { GridQuestion as GridQuestionType, GridAnswer } from "lib/types";

function getRelativeClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
  // e = Mouse click event.
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left; // x position within the element.
  const y = e.clientY - rect.top; // y position within the element.
  return { x, y };
}

interface GridQuestionProps {
  field: string;
  id: string;
}

// Make GridQuestion play nice with the informed library
// https://joepuzzo.github.io/informed/?selectedKind=CustomInputs&selectedStory=Creating Custom Inputs
const GridQuestion = (props: GridQuestionProps) => {
  const { fieldState, fieldApi } = useField<GridAnswer | undefined>(props);
  const { value } = fieldState;
  const { setValue } = fieldApi;
  return (
    <div className="grid">
      <div className="CircleContainer">
        {value !== undefined ? (
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
};

GridQuestion.propTypes = gridQuestionType;

export default GridQuestion;

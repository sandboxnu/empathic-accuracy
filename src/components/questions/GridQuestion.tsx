import React from "react";
import { useField } from "informed";
import { GridAnswer } from "lib/types";
import Grid from "./Grid";

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
  return <Grid x={value?.x || 0.5} y={value?.y || 0.5} onClick={setValue} />;
};

export default GridQuestion;

import React from "react";
import { useField } from "informed";
import { GridAnswer } from "lib/types";
import Grid from "./Grid";

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

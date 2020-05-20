import { string, arrayOf, oneOf } from "prop-types";

const commonQuestion = {
  id: string.isRequired,
  label: string.isRequired,
};

export const mcQuestionType = {
  ...commonQuestion,
  type: oneOf(["mc"]).isRequired,
  choices: arrayOf(string).isRequired,
};

export const scaleQuestionType = {
  ...commonQuestion,
  type: oneOf(["scale"]).isRequired,
  choices: arrayOf(string).isRequired,
};

export const openQuestionType = {
  ...commonQuestion,
  type: oneOf(["open"]).isRequired,
};

export const gridQuestionType = {
  ...commonQuestion,
  type: oneOf(["grid"]).isRequired,
};

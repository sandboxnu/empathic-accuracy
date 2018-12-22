import {
  number, string, arrayOf, exact, oneOfType, oneOf,
} from 'prop-types';

const commonQuestion = {
  id: string.isRequired,
  label: string.isRequired,
};

export const mcQuestionType = {
  ...commonQuestion,
  type: oneOf(['mc']).isRequired,
  choices: arrayOf(string).isRequired,
};

export const scaleQuestionType = {
  ...commonQuestion,
  type: oneOf(['scale']).isRequired,
  leftLabel: string.isRequired,
  rightLabel: string.isRequired,
  numChoices: number.isRequired,
};

export const openQuestionType = {
  ...commonQuestion,
  type: oneOf(['open']).isRequired,
};

export const gridQuestionType = {
  ...commonQuestion,
  type: oneOf(['grid']).isRequired,
  xaxis: string.isRequired,
  yaxis: string.isRequired,
};

export const questionType = oneOfType([
  exact(mcQuestionType),
  exact(scaleQuestionType),
  exact(openQuestionType),
  exact(gridQuestionType),
]);

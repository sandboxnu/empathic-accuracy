import {
  shape, number, string, arrayOf, exact,
} from 'prop-types';


export const mcQuestionType = exact({
  label: string.isRequired,
  choices: arrayOf(string).isRequired,
});

export const scaleQuestionType = exact({
  label: string.isRequired,
  leftLabel: string.isRequired,
  rightLabel: string.isRequired,
  numChoices: number.isRequired,
});

export const openQuestionType = exact({
  label: string.isRequired,
});

export const gridQuestionType = exact({
  label: string.isRequired,
  xaxis: string.isRequired,
  yaxis: string.isRequired,
});

export const questionType = shape({
  mc: mcQuestionType,
  scale: scaleQuestionType,
  open: openQuestionType,
  grid: gridQuestionType,
});

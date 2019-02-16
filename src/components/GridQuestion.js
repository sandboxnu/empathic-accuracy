/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { asField } from 'informed';
import { gridQuestionType } from '../types';
import grid from './affect.png';

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
      {value ? (
        <div className="circle" style={{ top: value.y, left: value.x }} />
      ) : null}
      <img
        onClick={e => setValue(getRelativeClick(e))}
        src={grid}
        alt="Grid"
      />
    </div>
  );
});


GridQuestion.propTypes = gridQuestionType;


export default GridQuestion;

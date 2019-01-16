import React from 'react';
import { Text } from 'informed';
import { openQuestionType } from '../types';


class OpenQuestion extends React.Component {
  render() {
    const { id, label } = this.props;
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <Text id={id} field={id} />
      </div>
    );
  }
}

OpenQuestion.propTypes = openQuestionType;


export default OpenQuestion;

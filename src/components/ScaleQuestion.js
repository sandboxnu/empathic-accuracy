import React from 'react';
import { RadioGroup, Radio } from 'informed';
import { scaleQuestionType } from '../types';


class ScaleQuestion extends React.Component {
  renderChoices() {
    const { id, choices } = this.props;
    const radios = choices.reduce((acc, choice, idx) => {
      const choiceId = `radio${id}-${idx}`;
      // the key property is required by React to identify list elements.
      acc.push(
        <li>
          <Radio id={choiceId} name="likert" value={choice} />
          <label htmlFor={choiceId}>{choice}</label>
        </li>,
      );
      return acc;
    }, []);
    return radios;
  }

  render() {
    const { id, label } = this.props;
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <RadioGroup id={id} field={id}>
        <ul className='likert' >
          {this.renderChoices()}
        </ul>
        </RadioGroup>
      </div>
    );
  }
}

ScaleQuestion.propTypes = scaleQuestionType;


export default ScaleQuestion;

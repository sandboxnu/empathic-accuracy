import React from 'react';
import { RadioGroup, Radio } from 'informed';
import { mcQuestionType } from './types';


class MultipleChoiceQuestion extends React.Component {
  renderChoices() {
    const { id, choices } = this.props;
    const radios = choices.reduce((acc, choice, idx) => {
      const choiceId = `radio${id}-${idx}`;
      // the key property is required by React to identify list elements.
      acc.push(<Radio key={choiceId} value={choice} id={choiceId} />);
      acc.push(<label key={`label${choiceId}`} htmlFor={choiceId}>{choice}</label>);
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
          {this.renderChoices()}
        </RadioGroup>
      </div>
    );
  }
}

MultipleChoiceQuestion.propTypes = mcQuestionType;


export default MultipleChoiceQuestion;

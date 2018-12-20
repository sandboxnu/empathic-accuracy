import React from 'react';
import { RadioGroup, Radio } from 'informed';
import { mcQuestionType } from './types';


class MultipleChoiceQuestion extends React.Component {
  renderChoices() {
    const { key, choices } = this.props;
    const radios = choices.reduce((acc, choice, idx) => {
      const id = `mc${key}-${idx}`;
      acc.push(<Radio value={choice} id={id} />);
      acc.push(<label htmlFor={id}>{choice}</label>);
      return acc;
    }, []);
    return radios;
  }

  render() {
    const { key, label } = this.props;
    const id = `mc${key}`;
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

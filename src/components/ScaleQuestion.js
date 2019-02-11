import React from 'react';
import { RadioGroup, Radio } from 'informed';
import { scaleQuestionType } from '../types';


class ScaleQuestion extends React.Component {
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
        <ul className='likert'>
          <li>
            <Radio id="strong_agree" name="likert" value="strong_agree" />
            <label htmlFor="strong_agree">Strongly agree</label>
          </li>
          <li>
            <Radio id="agree" name="likert" value="agree" />
            <label htmlFor="agree">Agree</label>
          </li>
          <li>
            <Radio id="neutral" name="likert" value="neutral" />
            <label htmlFor="neutral">Neutral</label>
          </li>
          <li>
            <Radio id="disagree" name="likert" value="disagree" />
            <label htmlFor="disagree">Disagree</label>
          </li>
          <li>
            <Radio id="strong_disagree" name="likert" value="strong_disagree" />
            <label htmlFor="strong_disagree">Strongly disagree</label>
          </li>
        </ul>
        </RadioGroup>
      </div>
    );
  }
}

ScaleQuestion.propTypes = scaleQuestionType;


export default ScaleQuestion;

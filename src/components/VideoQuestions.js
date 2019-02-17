/* eslint-disable react/no-array-index-key */
import { Form } from 'informed';
import PropTypes from 'prop-types';
import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OpenQuestion from './OpenQuestion';
import GridQuestion from './GridQuestion';
import ScaleQuestion from './ScaleQuestion';

class VideoQuestions extends React.Component {
  // Get the Informed form api to extract form values
  setFormApi(formApi) {
    this.formApi = formApi;
  }

  // Pass the form values up
  handleSubmit() {
    const { onSubmit, videoPos } = this.props;
    const answers = this.formApi.getState().values;
    // add the actual time stamp user is at here:
    answers.timestamp = videoPos;
    onSubmit(answers);
  }

  // Render a list of questions
  renderQuestions() {
    const { questions } = this.props;
    const formQuestions = questions.map((question, idx) => {
      const { type } = question;
      const id = idx.toString();
      switch (type) {
        case 'mc': return <MultipleChoiceQuestion key={id} id={id} {...question} />;
        case 'scale': return <ScaleQuestion key={id} id={id} {...question} />;
        case 'open': return <OpenQuestion key={id} id={id} {...question} />;
        case 'grid': return <GridQuestion key={id} field={id} {...question} />;
        default: return null;
      }
    });
    return formQuestions;
  }

  render() {
    return (
      <Form getApi={formApi => this.setFormApi(formApi)}>
        {this.renderQuestions()}
        <button onClick={() => this.handleSubmit()} type="submit">Save</button>
      </Form>
    );
  }
}

VideoQuestions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
  videoPos: PropTypes.number.isRequired,
};

export default VideoQuestions;

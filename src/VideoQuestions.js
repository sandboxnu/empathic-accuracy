import { Form } from 'informed';
import PropTypes from 'prop-types';
import React from 'react';
import { questionType } from './types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OpenQuestion from './OpenQuestion';

class VideoQuestions extends React.Component {
  // Get the Informed form api to extract form values
  setFormApi(formApi) {
    this.formApi = formApi;
  }

  // Pass the form values up
  handleSubmit() {
    const { onSubmit } = this.props;
    onSubmit(this.formApi.getState().values);
  }

  // Render a list of questions
  renderQuestions() {
    const { questions } = this.props;
    const formQuestions = questions.map((question) => {
      const { type, id } = question;
      switch (type) {
        case 'mc': return <MultipleChoiceQuestion key={id} {...question} />;
        case 'scale': return <span>scale questions not supported yet</span>;
        case 'open': return <OpenQuestion key={id} {...question} />;
        case 'grid': return <span>scale questions not supported yet</span>;
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
  questions: PropTypes.arrayOf(questionType).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default VideoQuestions;

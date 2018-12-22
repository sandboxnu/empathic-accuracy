import { Form } from 'informed';
import PropTypes from 'prop-types';
import React from 'react';
import { questionType } from './types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OpenQuestion from './OpenQuestion';

class VideoQuestions extends React.Component {
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
      <Form>
        {this.renderQuestions()}
      </Form>
    );
  }
}

VideoQuestions.propTypes = {
  questions: PropTypes.arrayOf(questionType).isRequired,
};

export default VideoQuestions;

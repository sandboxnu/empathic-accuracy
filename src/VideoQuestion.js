import { Form } from 'informed';
import PropTypes from 'prop-types';
import React from 'react';
import { questionType } from './types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

class VideoQuestion extends React.Component {
  renderQuestions() {
    const { questions } = this.props;
    const formQuestions = questions.map(({
      mc, scale, open, grid,
    }, i) => {
      if (mc) {
        return <MultipleChoiceQuestion key={i} {...mc} />;
      }
      if (scale) {
        return <span>temp</span>;
      }
      if (open) {
        return <span>temp</span>;
      }
      if (grid) {
        return <span>temp</span>;
      }
      return null;
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

VideoQuestion.propTypes = {
  questions: PropTypes.arrayOf(questionType).isRequired,
};

export default VideoQuestion;

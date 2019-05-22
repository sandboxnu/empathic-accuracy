/* eslint-disable react/no-array-index-key */
import { Form } from 'informed';
import PropTypes from 'prop-types';
import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import OpenQuestion from './OpenQuestion';
import GridQuestion from './GridQuestion';
import ContinuousGrid from './ContinuousGridQuestions';
import ScaleQuestion from './ScaleQuestion';

class VideoQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeQIndex: 0 };
  }

  // Get the Informed form api to extract form values
  setFormApi(formApi) {
    this.formApi = formApi;
  }

  // Pass the form values up
  handleSubmit() {
    const { onSubmit, videoPos, questions } = this.props;
    const { activeQIndex } = this.state;
    const answers = this.formApi.getState().values;
    // add the actual time stamp user is at here:
    answers.timestamp = videoPos;
    if (activeQIndex === questions.length - 1) {
      onSubmit(answers);
    } else {
      this.setState({ activeQIndex: activeQIndex + 1 });
    }
  }

  // Render a list of questions
  renderQuestions() {
    const { activeQIndex } = this.state;
    const {
      questions, videoPos, onGridExit, paused, onPlay,
    } = this.props;
    const formQuestions = questions.map((question, idx) => {
      const { type } = question;
      const id = idx.toString();
      const isActive = activeQIndex === idx;
      return (
        <div className={isActive ? 'activeQuestion' : ''}>
          {(() => {
            switch (type) {
              case 'mc':
                return (
                  <MultipleChoiceQuestion key={id} id={id} {...question} />
                );
              case 'scale':
                return <ScaleQuestion key={id} id={id} {...question} />;
              case 'open':
                return <OpenQuestion key={id} id={id} {...question} />;
              case 'grid':
                return (
                  <ContinuousGrid
                    key={id}
                    field={id}
                    {...question}
                    videoPos={videoPos}
                    onGridExit={onGridExit}
                    paused={paused}
                    onPlay={onPlay}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      );
    });
    return formQuestions;
  }

  render() {
    const { activeQIndex } = this.state;
    const { questions } = this.props;
    const isLast = activeQIndex === questions.length - 1;
    return (
      <Form getApi={formApi => this.setFormApi(formApi)}>
        {this.renderQuestions()}
        {isLast ? (
          <button onClick={() => this.handleSubmit()} type="submit">
            Save
          </button>
        ) : (
          <button onClick={() => this.handleSubmit()} type="submit">
            Next
          </button>
        )}
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

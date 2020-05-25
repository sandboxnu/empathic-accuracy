import { Form } from "informed";
import PropTypes from "prop-types";
import React from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import OpenQuestion from "./OpenQuestion";
import GridQuestion from "./GridQuestion";
import ScaleQuestion from "./ScaleQuestion";

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
    const { questions } = this.props;
    const formQuestions = questions.map((question, idx) => {
      const { type } = question;
      const id = idx.toString();
      const isActive = activeQIndex === idx;
      return (
        <div key={id} className={isActive ? "activeQuestion" : ""}>
          {(() => {
            switch (type) {
              case "mc":
                return <MultipleChoiceQuestion id={id} {...question} />;
              case "scale":
                return <ScaleQuestion id={id} {...question} />;
              case "open":
                return <OpenQuestion id={id} {...question} />;
              case "grid":
                return <GridQuestion field={id} {...question} />;
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
      <Form getApi={(formApi) => this.setFormApi(formApi)}>
        {this.renderQuestions()}
        {isLast ? (
          <button
            className="btn btn-primary"
            onClick={() => this.handleSubmit()}
            type="submit"
          >
            Resume
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => this.handleSubmit()}
            type="submit"
          >
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

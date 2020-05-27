import { Form } from "informed";
import React from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import OpenQuestion from "./OpenQuestion";
import GridQuestion from "./GridQuestion";
import ScaleQuestion from "./ScaleQuestion";
import { Question, AnswerSet } from "lib/types";
import GatedButton from "../GatedButton";

interface VideoQuestionsProps {
  onSubmit: (a: AnswerSet) => void;
  questions: Question[];
}
export default class VideoQuestions extends React.Component<
  VideoQuestionsProps,
  { activeQIndex: number }
> {
  constructor(props: VideoQuestionsProps) {
    super(props);
    this.state = { activeQIndex: 0 };
  }

  // Get the Informed form api to extract form values
  // Pass the form values up
  handleSubmit(answers: AnswerSet) {
    const { onSubmit } = this.props;
    onSubmit(answers);
  }

  // Render a list of questions
  renderQuestions() {
    const { activeQIndex } = this.state;
    const { questions } = this.props;
    const formQuestions = questions.map((question, idx) => {
      const id = idx.toString();
      const isActive = activeQIndex === idx;
      return (
        <div key={id} className={isActive ? "activeQuestion" : ""}>
          {(() => {
            switch (question.type) {
              case "mc":
                return <MultipleChoiceQuestion id={id} {...question} />;
              case "scale":
                return <ScaleQuestion id={id} {...question} />;
              case "open":
                return <OpenQuestion id={id} {...question} />;
              case "grid":
                return <GridQuestion id={id} field={id} {...question} />;
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
      <Form<AnswerSet>>
        {({ formState }) => {
          const isAnswerPresent = formState.values[activeQIndex];
          return (
            <>
              {this.renderQuestions()}
              {isLast ? (
                <GatedButton
                  disabled={!isAnswerPresent}
                  tooltip="Answer the question to continue"
                  onClick={() => this.handleSubmit(formState.values)}
                  type="submit"
                >
                  Resume
                </GatedButton>
              ) : (
                <GatedButton
                  disabled={!isAnswerPresent}
                  tooltip="Answer the question to continue"
                  onClick={() =>
                    this.setState({ activeQIndex: activeQIndex + 1 })
                  }
                  type="submit"
                >
                  Next
                </GatedButton>
              )}
            </>
          );
        }}
      </Form>
    );
  }
}

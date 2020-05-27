import VideoTaskView from "./VideoTaskView";
import VideoQuestions from "components/questions/VideoQuestions";
import { Question, AnswerSetWithMetadata, TrialInstructions } from "lib/types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface SelfVideoTaskProps {
  videoId: string;
  questions: Question[];
  instructions: TrialInstructions;
  onDone: (
    a: AnswerSetWithMetadata[],
    d: { videoWidth: number; videoHeight: number }
  ) => void;
}
export default function SelfVideoTask({
  videoId,
  questions,
  instructions,
  onDone,
}: SelfVideoTaskProps) {
  const [playing, setPlaying] = useState(true);
  const [showQuestionTime, setShowQuestionTime] = useState(Date.now());

  function showQuestions() {
    setPlaying(false);
    setShowQuestionTime(Date.now());
  }
  return (
    <VideoTaskView
      videoId={videoId}
      instructionsOverlay={instructions.instructionsOverlay}
      onDone={onDone}
      setPlaying={setPlaying}
      playing={playing}
      renderQuestions={(onSubmit) =>
        playing ? (
          <div className="questionPlaceholder">
            <ReactMarkdown source={instructions.pauseInstructions} />
            <button
              className="btn btn-primary"
              id="pauseButton"
              onClick={() => showQuestions()}
              type="button"
            >
              Pause
            </button>
          </div>
        ) : (
          <VideoQuestions
            onSubmit={(n) =>
              onSubmit({
                ...n,
                questionTime: (Date.now() - showQuestionTime) / 1000,
              })
            }
            questions={questions}
          />
        )
      }
    ></VideoTaskView>
  );
}

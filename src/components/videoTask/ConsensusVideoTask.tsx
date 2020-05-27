import { useState } from "react";
import VideoTaskView from "./VideoTaskView";
import VideoQuestions from "components/questions/VideoQuestions";
import { AnswerSetWithMetadata, Question, TrialInstructions } from "lib/types";
import ReactMarkdown from "react-markdown";

interface ConsensusVideoTaskProps {
  videoId: string;
  timepoints: number[];
  questions: Question[];
  instructions: TrialInstructions;
  onDone: (
    a: AnswerSetWithMetadata[],
    d: { videoWidth: number; videoHeight: number }
  ) => void;
}
export default function ConsensusVideoTask({
  videoId,
  timepoints,
  questions,
  instructions,
  onDone,
}: ConsensusVideoTaskProps) {
  const [playing, setPlaying] = useState(true);
  const [showQuestionTime, setShowQuestionTime] = useState(Date.now());
  const [nextTimepointIndex, setNextTimepointIndex] = useState(0);

  function onProgress(playedSeconds: number) {
    if (playedSeconds > timepoints[nextTimepointIndex]) {
      setPlaying(false);
      setShowQuestionTime(Date.now());
      setNextTimepointIndex(nextTimepointIndex + 1);
    }
  }
  return (
    <VideoTaskView
      videoId={videoId}
      instructionsOverlay={instructions.instructionsOverlay}
      onDone={onDone}
      onProgress={onProgress}
      setPlaying={setPlaying}
      playing={playing}
      renderQuestions={(onSubmit) =>
        playing ? (
          <div className="questionPlaceholder">
            <ReactMarkdown source={instructions.pauseInstructions} />
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

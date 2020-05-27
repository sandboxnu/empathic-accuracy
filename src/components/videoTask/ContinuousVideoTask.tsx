import {
  AnswerSetWithMetadata,
  GridAnswer,
  TrialInstructions,
} from "lib/types";
import ContinuousGrid from "../questions/ContinuousGridQuestions";
import VideoTaskView from "./VideoTaskView";
import { useState } from "react";

interface ContinuousVideoTaskProps {
  videoId: string;
  instructions: TrialInstructions;
  onDone: (
    a: AnswerSetWithMetadata[],
    d: { videoWidth: number; videoHeight: number }
  ) => void;
}
export default function ContinuousVideoTask({
  videoId,
  instructions,
  onDone,
}: ContinuousVideoTaskProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <VideoTaskView
      videoId={videoId}
      instructionsOverlay={instructions.instructionsOverlay}
      onDone={onDone}
      setPlaying={setPlaying}
      playing={playing}
      renderQuestions={(onSubmit) => (
        <div>
          <ContinuousGrid
            onValue={(value: GridAnswer) => {
              onSubmit([value]);
            }}
            onGridExit={() => {
              setPlaying(false);
            }}
            paused={!playing}
            onPlay={() => {
              setPlaying(true);
            }}
          />
        </div>
      )}
    ></VideoTaskView>
  );
}

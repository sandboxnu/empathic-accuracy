import { GridAnswer, TrialInstructions, ContinuousGridConfig } from "lib/types";
import ContinuousGrid from "../questions/ContinuousGridQuestions";
import VideoTaskView from "./VideoTaskView";
import { useState } from "react";
import { OnDone, SavePartialData } from "./taskTypes";

interface ContinuousVideoTaskProps {
  videoId: string;
  grid: ContinuousGridConfig;
  instructions: TrialInstructions;
  onDone: OnDone;
  savePartialData: SavePartialData;
}
export default function ContinuousVideoTask({
  videoId,
  grid,
  instructions,
  onDone,
  savePartialData,
}: ContinuousVideoTaskProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <VideoTaskView
      videoId={videoId}
      instructionsOverlay={instructions.instructionsOverlay}
      onDone={onDone}
      savePartialData={savePartialData}
      setPlaying={setPlaying}
      playing={playing}
      renderQuestions={(onSubmit) => (
        <div>
          <ContinuousGrid
            config={grid}
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

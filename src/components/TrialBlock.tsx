import { useState, useRef } from "react";
import {
  TrialBlockConfig,
  AnswerSetWithMetadata,
  VideoToAnswerSet,
} from "lib/types";
import Instructions from "./Instructions";
import { zipObject, shuffle } from "lodash";
import ConsensusVideoTask from "./videoTask/ConsensusVideoTask";
import ContinuousVideoTask from "./videoTask/ContinuousVideoTask";
import SelfVideoTask from "./videoTask/SelfVideoTask";
import { useShuffled } from "lib/useShuffled";
import { SavePartialData } from "./videoTask/taskTypes";
import TimestampVideoTask from "./videoTask/TimestampVideoTask";

enum StageEnum {
  instructions,
  showingVid,
  betweenVids,
}

export interface TrialResult {
  answers: VideoToAnswerSet;
  videoWidth: number;
  videoHeight: number;
}

interface TrialBlockProps {
  config: TrialBlockConfig;
  onDone: (data: TrialResult) => void;
  onPartialSave: (data: TrialResult) => void;
  skipInstructions?: boolean;
}
export default function TrialBlock({
  config,
  onDone,
  onPartialSave,
  skipInstructions = false,
}: TrialBlockProps) {
  const [stage, setStage] = useState(
    skipInstructions ? StageEnum.showingVid : StageEnum.instructions
  );
  const [vidIndex, setVidIndex] = useState(0);
  const videos = useShuffled(config.videos, config.shuffleVideos);
  const questions = useShuffled(config?.questions || [], config?.shuffleVideos);
  const data = useRef<VideoToAnswerSet>(
    zipObject(
      videos.map((v) => v.id),
      videos.map(() => [])
    )
  );

  const currentVideo = videos[vidIndex];

  function onVideoEnd(
    a: AnswerSetWithMetadata[],
    d: { videoWidth: number; videoHeight: number }
  ) {
    data.current[currentVideo.id] = a;
    if (vidIndex === videos.length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDone({
        answers: data.current,
        videoWidth: d.videoWidth,
        videoHeight: d.videoHeight,
      });
    } else {
      setStage(StageEnum.betweenVids);
      setVidIndex((i) => i + 1);
    }
  }
  const savePartialData: SavePartialData = (a, d) => {
    onPartialSave({
      answers: { ...data.current, [currentVideo.id]: a },
      videoWidth: d.videoHeight,
      videoHeight: d.videoHeight,
    });
  };
  if (stage === StageEnum.instructions) {
    return (
      <Instructions
        onFinish={() => setStage(StageEnum.showingVid)}
        instructionScreens={config.instructions.instructionScreens}
      />
    );
  } else if (stage === StageEnum.showingVid) {
    switch (config.paradigm) {
      case "continuous":
        return (
          <ContinuousVideoTask
            videoId={currentVideo.id}
            grid={config.grid}
            instructions={config.instructions}
            savePartialData={savePartialData}
            onDone={onVideoEnd}
          />
        );
      case "consensus":
        return (
          <ConsensusVideoTask
            videoId={currentVideo.id}
            timepoints={currentVideo.timepoints}
            instructions={config.instructions}
            questions={questions}
            savePartialData={savePartialData}
            onDone={onVideoEnd}
          />
        );
      case "timestamp":
        return (
          <TimestampVideoTask
            videoId={currentVideo.id}
            instructions={config.instructions}
            savePartialData={savePartialData}
            onDone={onVideoEnd}
          />
        );
      case "self":
        return (
          <SelfVideoTask
            videoId={currentVideo.id}
            instructions={config.instructions}
            questions={questions}
            savePartialData={savePartialData}
            onDone={onVideoEnd}
          />
        );
    }
  } else {
    return (
      <Instructions
        onFinish={() => setStage(StageEnum.showingVid)}
        instructionScreens={["Click next to watch the next video"]}
      />
    );
  }
}

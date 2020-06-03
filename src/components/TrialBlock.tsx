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
  skipInstructions?: boolean;
}
export default function TrialBlock({
  config,
  onDone,
  skipInstructions = false,
}: TrialBlockProps) {
  const [stage, setStage] = useState(
    skipInstructions ? StageEnum.showingVid : StageEnum.instructions
  );
  const [vidIndex, setVidIndex] = useState(0);
  const videos = useState(
    config.shuffleVideos ? shuffle(config.videos) : config.videos
  )[0];
  const questions = useState(
    config?.shuffleQuestions
      ? shuffle(config.questions)
      : config?.questions || []
  )[0];
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
            instructions={config.instructions}
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
            onDone={onVideoEnd}
          />
        );
      case "self":
        return (
          <SelfVideoTask
            videoId={currentVideo.id}
            instructions={config.instructions}
            questions={questions}
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

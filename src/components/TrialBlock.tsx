import { useState, useRef } from "react";
import {
  TrialBlockConfig,
  AnswerSetWithMetadata,
  AnswerSet,
  VideoToAnswerSet,
} from "lib/types";
import ReactPlayer from "react-player";
import ContinuousGrid from "./questions/ContinuousGridQuestions";
import VideoQuestions from "./questions/VideoQuestions";
import Instructions from "./Instructions";
import { zipObject, shuffle } from "lodash";
import VideoTask from "./VideoTask";

enum StageEnum {
  showingVid,
  betweenVids,
}

interface TrialResult {
  answers: VideoToAnswerSet;
  videoWidth: number;
  videoHeight: number;
}

interface TrialBlockProps {
  config: TrialBlockConfig;
  onFinish: (data: TrialResult) => void;
}
export default function TrialBlock({ config, onFinish }: TrialBlockProps) {
  const [stage, setStage] = useState(StageEnum.showingVid);
  const [vidIndex, setVidIndex] = useState(0);
  const videos = useState(
    config.shuffleVideos ? shuffle(config.videos) : config.videos
  )[0];
  const questions = useState(
    config.shuffleQuestions ? shuffle(config.questions) : config.questions
  )[0];
  const data = useRef<VideoToAnswerSet>(
    zipObject(
      videos.map((v) => v.id),
      videos.map((v) => [])
    )
  );

  const currentVideo = videos[vidIndex];

  function onVideoEnd() {
    if (vidIndex === videos.length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const width = (playerRef.current as any)?.wrapper.clientWidth;
      onFinish({
        answers: data.current,
        videoWidth: width,
        videoHeight: (width / 16) * 9,
      });
    } else {
      setPaused(config.paradigm === "continuous");
      setStage(StageEnum.betweenVids);
      setVidIndex((i) => i + 1);
      setNextTimepointIndex(0);
    }
  }


  if (stage === StageEnum.showingVid) {
    return <VideoTask />;
  } else {
    return (
      <Instructions
        onFinish={() => setStage(StageEnum.showingVid)}
        instructionScreens={["Click next to watch the next video"]}
      />
    );
  }
}

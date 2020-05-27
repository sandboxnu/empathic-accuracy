import { useState, useRef } from "react";
import {
  TrialBlockConfig,
  AnswerSetWithMetadata,
  AnswerSet,
  VideoToAnswerSet,
} from "lib/types";
import ReactPlayer from "react-player";
import ContinuousGrid from "./ContinuousGridQuestions";
import VideoQuestions from "./VideoQuestions";
import Instructions from "./Instructions";
import { zipObject, shuffle } from "lodash";

interface OverlayInstructionProps {
  instructionsOverlay: string;
  onOpen: () => void;
}
function OverlayInstruction({
  instructionsOverlay,
  onOpen,
}: OverlayInstructionProps) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div
        id="myNav"
        className="overlay"
        style={{ width: show ? "100%" : "0%" }}
      >
        <div
          className="closebtn"
          onClick={() => {
            setShow(false);
          }}
        >
          &times;
        </div>
        <div className="overlay-content">
          <div>{instructionsOverlay}</div>
        </div>
      </div>
      <div
        className="instructionsButton"
        onClick={() => {
          setShow(true);
          onOpen();
        }}
      >
        Help
      </div>
    </>
  );
}

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

  const [paused, setPaused] = useState(config.paradigm === "continuous");
  const [showQuestionTime, setShowQuestionTime] = useState(Date.now());
  const [nextTimepointIndex, setNextTimepointIndex] = useState(0);
  const data = useRef<VideoToAnswerSet>(
    zipObject(
      videos.map((v) => v.id),
      videos.map((v) => [])
    )
  );

  const currentVideo = videos[vidIndex];

  const playerRef = useRef<ReactPlayer>(null);

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
  // Add the new data point from VideoQuestions and resume the video
  function onSubmit(newValue: AnswerSet) {
    const withMetadata: AnswerSetWithMetadata = {
      ...newValue,
      timestamp: playerRef.current?.getCurrentTime(),
      questionTime: (Date.now() - showQuestionTime) / 1000,
    };
    data.current[currentVideo.id].push(withMetadata);
    setPaused(false);
  }

  function onPause() {
    console.log("onpause");
    setPaused(true);
    setShowQuestionTime(Date.now());
  }

  function onProgress({ playedSeconds }: { playedSeconds: number }) {
    if (config.paradigm === "consensus") {
      if (playedSeconds > currentVideo.timepoints[nextTimepointIndex]) {
        onPause();
        setNextTimepointIndex(nextTimepointIndex + 1);
      }
    }
  }

  function renderQuestions() {
    if (config.paradigm === "continuous") {
      return (
        <div>
          <ContinuousGrid
            onValue={(value: AnswerSetWithMetadata) => {
              data.current[currentVideo.id].push(value);
            }}
            getVideoPos={() =>
              playerRef.current ? playerRef.current.getCurrentTime() : 0
            }
            onGridExit={() => {
              setPaused(true);
            }}
            paused={paused}
            onPlay={() => {
              setPaused(false);
            }}
          />
        </div>
      );
    }
    if (paused) {
      return (
        <VideoQuestions onSubmit={(n) => onSubmit(n)} questions={questions} />
      );
    }
    if (config.paradigm === "self") {
      return (
        <div className="questionPlaceholder">
          Click pause and questions will appear here.
          <button
            className="btn btn-primary"
            id="pauseButton"
            onClick={() => onPause()}
            type="button"
          >
            Pause
          </button>
        </div>
      );
    }
    if (config.paradigm === "consensus") {
      return (
        <div className="questionPlaceholder">
          The video will pause automatically and questions will appear here.
        </div>
      );
    }
  }

  if (stage === StageEnum.showingVid) {
    return (
      <div className="Video">
        <div>
          <OverlayInstruction
            instructionsOverlay={config.instructionsOverlay}
            onOpen={() => setPaused(true)}
          />
        </div>
        <div className="videoContainer">
          <ReactPlayer
            className="videoPlayer"
            ref={playerRef}
            url={`https://vimeo.com/${currentVideo.id}`}
            onPlay={() => setPaused(false)}
            onEnded={() => onVideoEnd()}
            onProgress={(e) => onProgress(e)}
            playing={!paused}
            width="100%"
            height="100%"
            config={{
              vimeo: {
                playerOptions: {
                  controls: false,
                },
              },
            }}
          />
        </div>
        <div className="questionContainer">{renderQuestions()}</div>
      </div>
    );
  } else {
    return (
      <Instructions
        onFinish={() => setStage(StageEnum.showingVid)}
        instructionScreens={["Click next to watch the next video"]}
      />
    );
  }
}

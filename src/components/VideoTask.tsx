import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { AnswerSet, AnswerSetWithMetadata } from "lib/types";
import ContinuousGrid from "./questions/ContinuousGridQuestions";
import VideoQuestions from "./questions/VideoQuestions";

interface VideoTaskProps {
  questions: ;

}

export default function VideoTask({}) {
  const playerRef = useRef<ReactPlayer>(null);
  const [paused, setPaused] = useState(config.paradigm === "continuous");
  const [showQuestionTime, setShowQuestionTime] = useState(Date.now());
  const [nextTimepointIndex, setNextTimepointIndex] = useState(0);
  const data = useRef<AnswerSetWithMetadata[]>([]);

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
}

// Simple component for overlayed help panel
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

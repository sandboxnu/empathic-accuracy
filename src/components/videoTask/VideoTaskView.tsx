// "Dumb" view component of the video task. Delegates to the paradigm-specific controller views

import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { AnswerSetWithMetadata, AnswerSet } from "lib/types";
import { OnDone, SavePartialData } from "./taskTypes";

interface VideoTaskViewProps {
  videoId: string;
  instructionsOverlay: string;
  onProgress?: (playedSeconds: number) => void;
  setPlaying: (p: boolean) => void;
  playing: boolean;
  renderQuestions: (
    onSubmit: (a: Omit<AnswerSetWithMetadata, "timestamp">) => void
  ) => React.ReactNode;
  onDone: OnDone;
  savePartialData: SavePartialData;
}

export default function VideoTaskView({
  videoId,
  instructionsOverlay,
  onDone,
  onProgress,
  setPlaying,
  playing,
  renderQuestions,
  savePartialData,
}: VideoTaskViewProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const data = useRef<AnswerSetWithMetadata[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState(0);

  // Add the new data point from VideoQuestions and resume the video
  function onSubmit(newValue: AnswerSet) {
    const withMetadata: AnswerSetWithMetadata = {
      ...newValue,
      timestamp: playerRef.current?.getCurrentTime() || 0,
    };
    data.current.push(withMetadata);
    setPlaying(true);
  }
  const getDimensions = () => {
    const width = (playerRef.current as any)?.wrapper.clientWidth;
    return {
      videoWidth: width,
      videoHeight: (width / 16) * 9,
    };
  };

  return (
    <div className="Video">
      <div>
        <OverlayInstruction
          instructionsOverlay={instructionsOverlay}
          onOpen={() => setPlaying(false)}
        />
      </div>
      <div className="videoContainer">
        <ReactPlayer
          className="videoPlayer"
          ref={playerRef}
          url={`https://vimeo.com/${videoId}`}
          onPlay={() => setPlaying(true)}
          onEnded={() => {
            onDone(data.current, getDimensions());
          }}
          onProgress={({ playedSeconds }) => {
            onProgress && onProgress(playedSeconds);
            if (playedSeconds - lastSavedAt > 10) {
              savePartialData(data.current, getDimensions());
              setLastSavedAt(playedSeconds);
            }
          }}
          playing={playing}
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
      <div className="questionContainer">{renderQuestions(onSubmit)}</div>
    </div>
  );
}

// Simple component for overlayed help panel
interface OverlayInstructionProps {
  instructionsOverlay: string;
  onOpen: () => void;
}
export function OverlayInstruction({
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
          <ReactMarkdown source={instructionsOverlay} />
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

// "Dumb" view component of the video task. Delegates to the paradigm-specific controller views

import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import { AnswerSetWithMetadata, AnswerSet } from "lib/types";

interface VideoTaskViewProps {
  videoId: string;
  instructionsOverlay: string;
  onDone: (
    a: AnswerSetWithMetadata[],
    d: { videoWidth: number; videoHeight: number }
  ) => void;
  onProgress?: (playedSeconds: number) => void;
  setPlaying: (p: boolean) => void;
  playing: boolean;
  renderQuestions: (
    onSubmit: (a: AnswerSetWithMetadata) => void
  ) => React.ReactNode;
}

export default function VideoTaskView({
  videoId,
  instructionsOverlay,
  onDone,
  onProgress,
  setPlaying,
  playing,
  renderQuestions,
}: VideoTaskViewProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const data = useRef<AnswerSetWithMetadata[]>([]);

  // Add the new data point from VideoQuestions and resume the video
  function onSubmit(newValue: AnswerSetWithMetadata) {
    const withMetadata: AnswerSetWithMetadata = {
      ...newValue,
      timestamp: playerRef.current?.getCurrentTime(),
    };
    data.current.push(withMetadata);
    setPlaying(true);
  }

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
            const width = (playerRef.current as any)?.wrapper.clientWidth;
            onDone(data.current, {
              videoWidth: width,
              videoHeight: (width / 16) * 9,
            });
          }}
          onProgress={
            onProgress
              ? ({ playedSeconds }) => onProgress(playedSeconds)
              : undefined
          }
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

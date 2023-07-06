import VideoTaskView from "./VideoTaskView";
import { TimestampPrompt, TrialInstructions } from "lib/types";
import ReactMarkdown from "react-markdown";
import { OnDone, SavePartialData } from "./taskTypes";
import { useState } from "react";

type TimestampVideoTaskProps ={
  videoId: string;
  instructions: TrialInstructions;
  timestampPrompt: TimestampPrompt;
  onDone: OnDone;
  savePartialData: SavePartialData;
};
export default function TimestampVideoTask({
  videoId,
  instructions,
  timestampPrompt,
  onDone,
  savePartialData,
}: TimestampVideoTaskProps) {
  const [disabled, setDisabled] = useState(false);
  return (
    <VideoTaskView
      videoId={videoId}
      instructionsOverlay={instructions.instructionsOverlay}
      onDone={onDone}
      savePartialData={savePartialData}
      setPlaying={()=>{}}
      playing={true}
      renderQuestions={(onSubmit) =>
        (
          <div className="questionPlaceholder">
            <ReactMarkdown children={timestampPrompt.buttonInstructions || ""} />
            <button
              className="btn btn-primary"
              id="pauseButton"
              disabled={disabled}
              onClick={() => {
                console.log('clicked')
                setDisabled(true);
                onSubmit({});
                setTimeout(()=>setDisabled(false), 500);
              }}
              type="button"
            >
            {timestampPrompt.buttonText}
            </button>
          </div>
        ) 
      }
    ></VideoTaskView>
  );
}

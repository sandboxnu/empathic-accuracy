import VideoTaskView from "./VideoTaskView";
import { TimestampParadigmTrialBlockConfig } from "lib/types";
import ReactMarkdown from "react-markdown";
import { OnDone, SavePartialData } from "./taskTypes";
import { useState } from "react";

type TimestampVideoTaskProps ={
  videoId: string;
  onDone: OnDone;
  savePartialData: SavePartialData;
} & TimestampParadigmTrialBlockConfig;
export default function TimestampVideoTask({
  videoId,
  instructions,
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
            <ReactMarkdown children={instructions.buttonInstructions || ""} />
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
            {instructions.buttonText}
            </button>
          </div>
        ) 
      }
    ></VideoTaskView>
  );
}

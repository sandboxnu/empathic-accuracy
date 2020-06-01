import { TrialBlockConfig } from "lib/types";
import TrialBlock, { TrialResult } from "./TrialBlock";
import { useState } from "react";
import { sumBy, range } from "lodash";
import ReactMarkdown from "react-markdown";

interface TestTrialBlockProps {
  config: TrialBlockConfig;
  onProceed: (r: TrialResult) => void;
  onFail: (r: TrialResult) => void;
}
enum StageEnum {
  test,
  tryagainmessage,
}

export default function TestTrialBlock({
  config,
  onProceed,
  onFail,
}: TestTrialBlockProps) {
  const [tryCount, setTryCount] = useState(0);
  const [stage, setStage] = useState(StageEnum.test);

  if (stage === StageEnum.test) {
    return (
      <TrialBlock
        key={tryCount}
        onDone={(d) => {
          if (config.testTrial.enabled) {
            let proceed = true;
            if (config.paradigm === "consensus") {
              onProceed(d);
              return;
            }
            if (config.paradigm === "self") {
              proceed =
                config.testTrial.minSegments <=
                sumBy(Object.values(d.answers), (e) => e.length);
            }
            if (config.paradigm === "continuous") {
              const { maxSeconds } = config.testTrial;
              proceed = Object.values(d.answers).every((values) =>
                range(0, values.length - 1).every(
                  (i) =>
                    values[i + 1].timestamp - values[i].timestamp < maxSeconds
                )
              );
            }
            if (proceed) {
              onProceed(d);
            } else if (tryCount + 1 < config.testTrial.maxTries) {
              setTryCount(tryCount + 1);
            } else {
              onFail(d);
            }
          }
        }}
        config={config}
      />
    );
  } else {
    if (config.testTrial.enabled) {
      return (
        <div className="instructionsContainer">
          <p className="instructionsText">
            <ReactMarkdown source={config.testTrial.tryAgainMessage} />
          </p>
        </div>
      );
    } else {
      return <div>error state</div>;
    }
  }
}

import { TrialBlockConfig } from "lib/types";
import TrialBlock from "./TrialBlock";
import { useState } from "react";
import { sumBy, range } from "lodash";
import Instructions from "./Instructions";

interface TestTrialBlockProps {
  config: TrialBlockConfig;
  onProceed: () => void;
  onFail: () => void;
}
enum StageEnum {
  test,
  tryagainmessage,
  succeedmessage,
}

export default function TestTrialBlock({
  config,
  onProceed,
  onFail,
}: TestTrialBlockProps) {
  const [tryCount, setTryCount] = useState(0);
  const [stage, setStage] = useState(StageEnum.test);

  if (config.testTrial.enabled) {
    if (stage === StageEnum.test) {
      return (
        <TrialBlock
          key={tryCount}
          onPartialSave={() => { }}
          onDone={(d) => {
            if (config.testTrial.enabled) {
              let proceed = true;
              if (config.paradigm === "consensus") {
                setStage(StageEnum.succeedmessage);
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
                setStage(StageEnum.succeedmessage);
              } else if (tryCount + 1 < config.testTrial.maxTries) {
                setStage(StageEnum.tryagainmessage);
                setTryCount(tryCount + 1);
              } else {
                onFail();
              }
            }
          }}
          config={{ ...config, videos: [config.testTrial.video] }}
        />
      );
    } else if (stage === StageEnum.succeedmessage) {
      return (
        <Instructions
          instructionScreens={[config.testTrial.successMessage]}
          onFinish={() => onProceed()}
        />
      );
    } else {
      return (
        <Instructions
          instructionScreens={[config.testTrial.tryAgainMessage]}
          onFinish={() => setStage(StageEnum.test)}
        />
      );
    }
  } else {
    return <div>error state</div>;
  }
}

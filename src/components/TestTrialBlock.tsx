import { TrialBlockConfig } from "lib/types";
import TrialBlock, { TrialResult } from "./TrialBlock";
import { useState } from "react";
import { sumBy, range } from "lodash";

interface TestTrialBlockProps {
  config: TrialBlockConfig;
  onProceed: (r: TrialResult) => void;
  onFail: (r: TrialResult) => void;
}

export default function TestTrialBlock({
  config,
  onProceed,
  onFail,
}: TestTrialBlockProps) {
  const [tryCount, setTryCount] = useState(0);

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
}

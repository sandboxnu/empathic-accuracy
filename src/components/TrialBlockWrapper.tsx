import { TrialBlockConfig } from "lib/types";
import TrialBlock, { TrialResult } from "./TrialBlock";
import TestTrialBlock from "./TestTrialBlock";
import { useState } from "react";

interface TrialBlockWrapperProps {
  config: TrialBlockConfig;
  onFail: (r: TrialResult) => void;
  onDone: (data: TrialResult) => void;
}

export default function TrialBlockWrapper({
  config,
  onFail,
  onDone,
}: TrialBlockWrapperProps) {
  const [showingTrial, setShowingTrial] = useState(config.testTrial.enabled);
  return showingTrial ? (
    <TestTrialBlock
      config={config}
      onFail={onFail}
      onProceed={() => setShowingTrial(false)}
    />
  ) : (
    <TrialBlock config={config} skipInstructions onDone={onDone} />
  );
}

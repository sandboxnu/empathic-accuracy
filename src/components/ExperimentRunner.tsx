import React from "react";
import { Beforeunload } from "react-beforeunload";
import Instructions from "./Instructions";
import {
  ExperimentDataEntry,
  ExperimentConfig,
  ExperimentDataTrialBlock,
} from "lib/types";
import TrialBlock from "./TrialBlock";
import GatedButton from "./GatedButton";

interface ExperimentRunnerProps {
  config: ExperimentConfig;
  sendData: (data: ExperimentDataEntry) => void;
}

interface ExperimentRunnerState {
  stage: StageEnum;
  startTime: number;
  subjectID: string;
  data: ExperimentDataTrialBlock[];
  trialBlockIndex: number;
}

enum StageEnum {
  enterSubjectID,
  instructions,
  experiment,
  done,
}
const INITIALSTATE: ExperimentRunnerState = {
  stage: StageEnum.enterSubjectID,
  startTime: 0,
  subjectID: "",
  data: [],
  trialBlockIndex: 0,
};

class ExperimentRunner extends React.Component<
  ExperimentRunnerProps,
  ExperimentRunnerState
> {
  constructor(props: ExperimentRunnerProps) {
    super(props);
    // Parse csv timepoints
    this.state = { ...INITIALSTATE };
  }

  // The user has closed the tab - save data to localstorage.
  onClose(e: Event) {
    if (this.state.stage !== StageEnum.done) {
      e.preventDefault();
      return "You are in the middle of the experiment!";
    }
    return null;
  }

  renderInstructions() {
    const { instructionScreens } = this.props.config.trialBlocks[
      this.state.trialBlockIndex
    ].instructions;
    return (
      <Instructions
        onFinish={() => this.setState({ stage: StageEnum.experiment })}
        instructionScreens={instructionScreens}
      />
    );
  }

  renderExperiment() {
    const { trialBlockIndex } = this.state;
    const config = this.props.config.trialBlocks[trialBlockIndex];
    return (
      <TrialBlock
        key={trialBlockIndex}
        config={config}
        onDone={(result) => {
          const newData = [
            ...this.state.data,
            {
              answers: result.answers,
              paradigm: config.paradigm,
            },
          ];
          if (trialBlockIndex === this.props.config.trialBlocks.length - 1) {
            this.props.sendData({
              trialBlocks: newData,
              videoHeight: result.videoHeight,
              videoWidth: result.videoWidth,
              browserWidth: Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
              ),
              browserHeight: Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
              ),
              subjectID: this.state.subjectID,
              totalDuration: (Date.now() - this.state.startTime) / 1000,
            });
            this.setState({ stage: StageEnum.done });
          } else {
            this.setState({
              data: newData,
              stage: StageEnum.instructions,
              trialBlockIndex: trialBlockIndex + 1,
            });
          }
        }}
      />
    );
  }

  renderDone() {
    return (
      <div className="instructionsContainer">
        <p className="instructionsText">Thank you for participating.</p>
        <p className="instructionsText">You can close this browser tab.</p>
      </div>
    );
  }

  renderStage() {
    const { stage } = this.state;

    switch (stage) {
      case StageEnum.enterSubjectID:
        return this.renderEnterSubjectID();
      case StageEnum.instructions:
        return this.renderInstructions();
      case StageEnum.experiment:
        return this.renderExperiment();
      case StageEnum.done:
        return this.renderDone();
      default:
        return null;
    }
  }

  renderEnterSubjectID() {
    return (
      <div className="instructionsContainer">
        <div>
          Please enter your subject ID:
          <input
            onChange={(e) => this.setState({ subjectID: e.target.value })}
            value={this.state.subjectID}
          />
          <GatedButton
            disabled={!this.state.subjectID}
            tooltip="Enter your subject ID to continue"
            type="button"
            onClick={() => this.setState({ stage: StageEnum.instructions })}
          >
            Next &#8250;
          </GatedButton>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Beforeunload
        onBeforeunload={(e: Event) => {
          this.onClose(e);
        }}
      >
        {this.renderStage()}
      </Beforeunload>
    );
  }
}

export default ExperimentRunner;

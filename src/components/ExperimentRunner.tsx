import React from "react";
import { Beforeunload } from "react-beforeunload";
import {
  ExperimentDataEntry,
  ExperimentConfig,
  ExperimentDataTrialBlock,
  TrialBlockConfig,
} from "lib/types";
import { TrialResult } from "./TrialBlock";
import GatedButton from "./GatedButton";
import ReactMarkdown from "react-markdown";
import TrialBlockWrapper from "./TrialBlockWrapper";
import { shuffle } from "lodash";

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
  trialBlocks: TrialBlockConfig[];
}

enum StageEnum {
  enterSubjectID,
  experiment,
  done,
  fail,
}
const INITIALSTATE: ExperimentRunnerState = {
  stage: StageEnum.enterSubjectID,
  startTime: 0,
  subjectID: "",
  data: [],
  trialBlockIndex: 0,
  trialBlocks: [],
};

class ExperimentRunner extends React.Component<
  ExperimentRunnerProps,
  ExperimentRunnerState
> {
  constructor(props: ExperimentRunnerProps) {
    super(props);
    // Parse csv timepoints
    this.state = {
      ...INITIALSTATE,
      trialBlocks: props.config.shuffleTrialBlocks
        ? shuffle(props.config.trialBlocks)
        : props.config.trialBlocks,
    };
  }

  // The user has closed the tab - save data to localstorage.
  onClose(e: Event) {
    if (![StageEnum.done, StageEnum.fail].includes(this.state.stage)) {
      e.preventDefault();
      return "You are in the middle of the experiment!";
    }
    return null;
  }

  renderExperiment() {
    const { trialBlockIndex } = this.state;
    const config = this.state.trialBlocks[trialBlockIndex];
    const buildData = (
      data: ExperimentDataTrialBlock[],
      result: TrialResult,
      unfinished?: boolean
    ) => ({
      trialBlocks: data,
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
      unfinished: unfinished ? true : undefined,
    });
    return (
      <TrialBlockWrapper
        key={trialBlockIndex}
        config={config}
        onFail={() => {
          this.setState({ stage: StageEnum.fail });
        }}
        onPartialSave={(result) => {
          const newData = [
            ...this.state.data,
            {
              answers: result.answers,
              paradigm: config.paradigm,
            },
          ];
          this.props.sendData(buildData(newData, result, true));
        }}
        onDone={(result) => {
          const newData = [
            ...this.state.data,
            {
              answers: result.answers,
              paradigm: config.paradigm,
            },
          ];
          if (trialBlockIndex === this.state.trialBlocks.length - 1) {
            this.props.sendData(buildData(newData, result));
            this.setState({ stage: StageEnum.done });
          } else {
            this.setState({
              data: newData,
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
      case StageEnum.experiment:
        return this.renderExperiment();
      case StageEnum.done:
        return this.renderDone();
      case StageEnum.fail:
        return this.renderFail();
      default:
        return null;
    }
  }

  renderFail() {
    const { testTrial } = this.state.trialBlocks[this.state.trialBlockIndex];
    if (testTrial.enabled) {
      return (
        <div className="instructionsContainer">
          <p className="instructionsText">
            <ReactMarkdown children={testTrial.failMessage} />
          </p>
        </div>
      );
    } else {
      return <div>error state</div>;
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
            onClick={() => this.setState({ stage: StageEnum.experiment })}
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

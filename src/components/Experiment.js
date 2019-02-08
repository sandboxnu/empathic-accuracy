import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import Beforeunload from 'react-beforeunload';
import { reactLocalStorage } from 'reactjs-localstorage';
import VideoQuestions from './VideoQuestions';
import { questionType } from '../types';
import Instructions from './Instructions';

const StageEnum = { instructions: 1, experiment: 2, done: 3 };
const INITIALSTATE = {
  restoredPos: 0,
  paused: false,
  data: [],
  stage: StageEnum.instructions,
  showQuestionTime: 0,
  startTime: 0,
  elapsedTotalTime: 0,
};

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIALSTATE;
  }

  componentDidMount() {
    const restoredState = reactLocalStorage.getObject('var');
    this.setState({
      ...restoredState,
      startTime: Date.now(),
    });
  }

  // Add the new data point from VideoQuestions and resume the video
  onSubmit(newValue) {
    const { data, showQuestionTime } = this.state;
    const newerValue = { ...newValue, questionTime: (Date.now() - showQuestionTime) / 1000 };
    this.setState({
      data: [...data, newerValue],
      paused: false,
    });
  }

  // Seek the player to the position in video restored by localstorage.
  onReady() {
    const { restoredPos } = this.state;
    this.player.seekTo(restoredPos);
  }

  onPause() {
    this.setState({
      paused: true,
      showQuestionTime: Date.now(),
    });
  }

  onPlay() {
    this.setState({ paused: false });
  }

  // Send data up to server
  onEnded() {
    const { data, startTime, elapsedTotalTime } = this.state;
    const { sendData } = this.props;
    sendData({ ...data, totalDuration: (elapsedTotalTime + (Date.now() - startTime)) / 1000 });
    this.setState({
      stage: StageEnum.done,
    });
  }

  // The user has closed the tab - save data to localstorage.
  onClose() {
    const { elapsedTotalTime, startTime } = this.state;
    const save = {
      ...this.state,
      elapsedTotalTime: elapsedTotalTime + Date.now() - startTime,
      restoredPos: this.player.getCurrentTime() || 0,
    };

    reactLocalStorage.setObject('var', save);
  }

  getPlayerRef(ref) {
    this.player = ref;
  }

  renderInstructions() {
    const { instructionScreens } = this.props;
    return (
      <Instructions
        onFinish={() => this.setState({ stage: StageEnum.experiment })}
        instructionScreens={instructionScreens}
      />
    );
  }

  renderExperiment() {
    const { videoId, questions } = this.props;
    const { paused } = this.state;
    const videoUrl = `https://vimeo.com/${videoId}`;
    return (
      <div>
        <ReactPlayer
          ref={r => this.getPlayerRef(r)}
          url={videoUrl}
          onReady={() => this.onReady()}
          onPause={() => this.onPause()}
          onPlay={() => this.onPlay()}
          onSeek={() => this.onSeek()}
          onEnded={() => this.onEnded()}
          playing={!paused}
        />
        <div className="questionContainer">
          {paused && this.player ? (
            <VideoQuestions
              onSubmit={n => this.onSubmit(n)}
              questions={questions}
              videoPos={this.player.getCurrentTime()}
            />
          ) : (
            <div className="questionPlaceholder">Pause the video and questions will appear here.</div>
          )}
        </div>
      </div>
    );
  }

  renderStage() {
    const { stage } = this.state;

    switch (stage) {
      case StageEnum.instructions:
        return this.renderInstructions();
      case StageEnum.experiment:
        return this.renderExperiment();
      case StageEnum.done:
        return (
          <div>
            <span>Thank you for participating. You can close this browser tab. </span>
            <br />
            <button
              type="button"
              bsStyle="primary"
              onClick={() => {
                reactLocalStorage.clear();
                this.setState(INITIALSTATE);
              }}
            >
            Start again
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <Beforeunload onBeforeunload={() => { this.onClose(); }}>
        { this.renderStage() }
      </Beforeunload>
    );
  }
}

Experiment.propTypes = {
  videoId: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(questionType).isRequired,
  sendData: PropTypes.func.isRequired,
  instructionScreens: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Experiment;

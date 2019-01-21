import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import VideoQuestions from './VideoQuestions';
import { questionType } from '../types';
import Instructions from './Instructions';

const StageEnum = { instructions: 1, experiment: 2, done: 3 };

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPos: 0,
      justReset: false,
      paused: false,
      data: [],
      stage: StageEnum.instructions,
      showQuestionTime: 0,
      startTime: 0,
    };
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

  // Keep track of video progress to override user skipping around.
  // Would just be better to hide controls, but that requires Vimeo Plus
  onProgress({ played }) {
    this.setState({ lastPos: played });
  }

  // Reset the video if user tries skipping around.
  onSeek() {
    // Have to keep track of justReset to avoid looping onSeek.
    const { justReset, lastPos } = this.state;
    if (justReset) {
      this.setState({ justReset: false });
    } else {
      this.setState({ justReset: true });
      this.player.seekTo(lastPos);
      // eslint-disable-next-line no-alert, no-undef
      alert('Please do not skip around the video');
    }
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

  componentDidMount() {
    this.setState({
      startTime: Date.now(),
    });
  }

  onEnded() {
    const { data, startTime } = this.state;
    const { sendData, completionID } = this.props;
    sendData({
      ...data,
      totalDuration: (Date.now() - startTime) / 1000,
      completionID,
    });
    this.setState({
      stage: StageEnum.done,
    });
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
          onPause={() => this.onPause()}
          onPlay={() => this.onPlay()}
          onProgress={p => this.onProgress(p)}
          onSeek={() => this.onSeek()}
          onEnded={() => this.onEnded()}
          playing={!paused}
        />
        <div className="questionContainer">
          {paused ? (
            <VideoQuestions
              onSubmit={n => this.onSubmit(n)}
              questions={questions}
              lastPos={this.player.getCurrentTime()}
            />
          ) : (
            <div className="questionPlaceholder">Pause the video and questions will appear here.</div>
          )}
        </div>
      </div>
    );
  }

  renderDone() {
    const { completionID } = this.props;
    return (
      <div className="instructionsContainer">
        <p className="instructionsText">
          Thank you for participating.
        </p>
        <p className="instructionsText">
          Your completion ID is
          {' '}
          <span className="completionID">{completionID}</span>
        </p>
        <p className="instructionsText">
        You can close this browser tab.
        </p>
      </div>
    );
  }

  render() {
    const { stage } = this.state;

    switch (stage) {
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
}

Experiment.propTypes = {
  videoId: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(questionType).isRequired,
  sendData: PropTypes.func.isRequired,
  instructionScreens: PropTypes.arrayOf(PropTypes.string).isRequired,
  completionID: PropTypes.string.isRequired,
};

export default Experiment;

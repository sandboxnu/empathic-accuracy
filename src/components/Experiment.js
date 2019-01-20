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

  onEnded() {
    const { data } = this.state;
    const { sendData } = this.props;
    sendData(data);
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

  render() {
    const { stage } = this.state;

    switch (stage) {
      case StageEnum.instructions:
        return this.renderInstructions();
      case StageEnum.experiment:
        return this.renderExperiment();
      case StageEnum.done:
        return (<span>Thank you for participating. You can close this browser tab.</span>);
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
};

export default Experiment;

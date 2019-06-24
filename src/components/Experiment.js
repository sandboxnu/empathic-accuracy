import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import Beforeunload from 'react-beforeunload';
import { reactLocalStorage } from 'reactjs-localstorage';
import VideoQuestions from './VideoQuestions';
import Instructions from './Instructions';
import ContinuousGrid from './ContinuousGridQuestions';

const StageEnum = { instructions: 1, experiment: 2, done: 3 };
const INITIALSTATE = {
  restoredPos: 0,
  data: {},
  videoIndex: 0,
  stage: StageEnum.instructions,
  showQuestionTime: 0,
  startTime: 0,
  elapsedTotalTime: 0,
};
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(array) {
  let counter = array.length;
  const ret = array.slice();

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter -= 1;

    // And swap the last element with it
    const temp = ret[counter];
    ret[counter] = ret[index];
    ret[index] = temp;
  }

  return ret;
}

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    const { videoIds, paradigm, shuffleVideos } = this.props;
    this.state = {
      shuffledVideos: shuffleVideos ? shuffle(videoIds) : videoIds,
      ...INITIALSTATE,
      paused: paradigm === 'continuous',
    };
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
    const {
      data, showQuestionTime,
    } = this.state;
    const currentVideo = this.getCurrentVideoId();
    const videoData = data[currentVideo] || [];
    const newerValue = {
      ...newValue,
      questionTime: (Date.now() - showQuestionTime) / 1000,
    };
    const updatedData = { ...data, [currentVideo]: [...videoData, newerValue] };
    this.setState({
      data: updatedData,
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

  onVideoEnd() {
    const { videoIndex, shuffledVideos } = this.state;
    if (videoIndex === shuffledVideos.length - 1) {
      this.sendData();
    } else {
      this.setState({
        videoIndex: videoIndex + 1,
      });
    }
  }

  // The user has closed the tab - save data to localstorage.
  onClose() {
    const { elapsedTotalTime, startTime, stage } = this.state;
    const restoredPos = stage === 2 ? this.player.getCurrentTime() : 0;
    const save = {
      ...this.state,
      elapsedTotalTime: elapsedTotalTime + Date.now() - startTime,
      restoredPos,
    };

    reactLocalStorage.setObject('var', save);
  }

  getCurrentVideoId() {
    const { shuffledVideos, videoIndex } = this.state;
    return shuffledVideos[videoIndex];
  }

  getPlayerRef(ref) {
    this.player = ref;
  }

  // Send data up to server
  sendData() {
    const { data, startTime, elapsedTotalTime } = this.state;
    const { sendData, completionID } = this.props;
    const dataWithBrowserInfo = {
      answers: data,
      browserWidth: Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      ),
      browserHeight: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      ),
      videoWidth: this.player.wrapper.clientWidth,
      videoHeight: this.player.wrapper.clientHeight,
      totalDuration: (elapsedTotalTime + (Date.now() - startTime)) / 1000,
      completionID,
    };
    sendData(dataWithBrowserInfo);

    this.setState({
      stage: StageEnum.done,
    });
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

  handleClick() {
    this.setState({ paused: false });
  }

  renderExperiment() {
    const {
      paused,
      isInstructionOpen,
    } = this.state;
    const videoUrl = `https://vimeo.com/${this.getCurrentVideoId()}`;

    return (
      <div className="Video">
        <div
          id="myNav"
          className="overlay"
          style={{ width: isInstructionOpen ? '100%' : '0%' }}
        >
          <div
            className="closebtn"
            onClick={() => {
              this.setState({ isInstructionOpen: false });
            }}
          >
            &times;
          </div>
          <div className="overlay-content">
            <div>hello, instructions</div>
          </div>
        </div>
        <div
          className="instructionsButton"
          onClick={() => {
            this.setState({ isInstructionOpen: true, paused: true });
          }}
        >
          Help
        </div>
        <div className="videoContainer">
          <ReactPlayer
            className="videoPlayer"
            ref={r => this.getPlayerRef(r)}
            url={videoUrl}
            onReady={() => this.onReady()}
            onPause={() => this.onPause()}
            onPlay={() => this.onPlay()}
            onSeek={() => this.onSeek()}
            onEnded={() => this.onVideoEnd()}
            playing={!paused}
            width="100%"
            height="100%"
          />
        </div>
        <div className="questionContainer">
          {this.renderQuestions()}
        </div>
      </div>
    );
  }

  renderQuestions() {
    const { paused } = this.state;
    const { paradigm, questions } = this.props;
    if (paradigm === 'continuous') {
      const { data } = this.state;
      const currentVideo = this.getCurrentVideoId();
      return (
        <div>
          <ContinuousGrid
            field="grid"
            values={data[currentVideo]}
            addValue={(value) => {
              const videoData = data[currentVideo] || [];
              this.setState({
                data: { ...data, [currentVideo]: [...videoData, value] },
              });
            }}
            videoPos={this.player ? this.player.getCurrentTime() : 0}
            onGridExit={() => {
              this.setState({ paused: true });
            }}
            paused={paused}
            onPlay={() => {
              this.onPlay();
            }}
          />
        </div>
      );
    }
    if (paused) {
      return (
        <VideoQuestions
          onSubmit={n => this.onSubmit(n)}
          questions={questions}
          videoPos={this.player ? this.player.getCurrentTime() : 0}
        />
      );
    }
    return (
      <div className="questionPlaceholder">
        Pause the video and questions will appear here.
      </div>
    );
  }

  renderDone() {
    const { completionID, completionLink, paradigm } = this.props;
    return (
      <div className="instructionsContainer">
        <p className="instructionsText">Thank you for participating.</p>
        <p className="instructionsText">
          Your completion ID is
          {' '}
          <span className="completionID">{completionID}</span>
        </p>
        <p className="instructionsText">
          Please take this survey at the following link:
          {' '}
          <a href={completionLink}>{completionLink}</a>
        </p>
        <p className="instructionsText">You can close this browser tab.</p>
        <button
          type="button"
          onClick={() => {
            reactLocalStorage.clear();
            this.setState({
              ...INITIALSTATE,
              paused: paradigm === 'continuous',
            });
          }}
        >
          Start again
        </button>
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
        return this.renderDone();
      default:
        return null;
    }
  }

  render() {
    return (
      <Beforeunload
        onBeforeunload={() => {
          this.onClose();
        }}
      >
        {this.renderStage()}
      </Beforeunload>
    );
  }
}

Experiment.propTypes = {
  paradigm: PropTypes.string.isRequired,
  videoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  sendData: PropTypes.func.isRequired,
  instructionScreens: PropTypes.arrayOf(PropTypes.string).isRequired,
  completionID: PropTypes.string.isRequired,
  completionLink: PropTypes.string.isRequired,
};

export default Experiment;

import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import Beforeunload from 'react-beforeunload';
import { reactLocalStorage } from 'reactjs-localstorage';
import VideoQuestions from './VideoQuestions';
import Instructions from './Instructions';

const StageEnum = { instructions: 1, experiment: 2, done: 3 };
const INITIALSTATE = {
  restoredPos: 0,
  paused: false,
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
function shuffle(a) {
  let j;
  let x;
  let i;
  const b = [];
  for (i = a.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    b[i] = a[j];
    b[j] = x;
  }
  return b;
}

class Experiment extends React.Component {
  constructor(props) {
    super(props);
    const { videoIds } = this.props;
    this.state = {
      shuffledVideos: shuffle(videoIds),
      ...INITIALSTATE,
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
    const { videoIndex, data, showQuestionTime, shuffledVideos } = this.state;
    const currentVideo = shuffledVideos[videoIndex];
    const videoData = data[currentVideo] || [];
    const newerValue = { ...newValue, questionTime: (Date.now() - showQuestionTime) / 1000 };
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
        paused: false,
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

  getPlayerRef(ref) {
    this.player = ref;
  }

  // Send data up to server
  sendData() {
    const { data, startTime, elapsedTotalTime } = this.state;
    const { sendData, completionID } = this.props;
    const dataWithBrowserInfo = {
      answers: data,
      browserWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      browserHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
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

  renderExperiment() {
    const { questions } = this.props;
    const { paused, videoIndex, shuffledVideos } = this.state;
    const videoId = shuffledVideos[videoIndex];
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
          onEnded={() => this.onVideoEnd()}
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

  renderDone() {
    const { completionID, completionLink } = this.props;
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
          Please take this survey at the following link:
          {' '}
          <a href={completionLink}>{completionLink}</a>
        </p>
        <p className="instructionsText">
        You can close this browser tab.
        </p>
        <button
          type="button"
          onClick={() => {
            reactLocalStorage.clear();
            this.setState(INITIALSTATE);
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
      <Beforeunload onBeforeunload={() => { this.onClose(); }}>
        { this.renderStage() }
      </Beforeunload>
    );
  }
}

Experiment.propTypes = {
  videoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  sendData: PropTypes.func.isRequired,
  instructionScreens: PropTypes.arrayOf(PropTypes.string).isRequired,
  completionID: PropTypes.string.isRequired,
  completionLink: PropTypes.string.isRequired,
};

export default Experiment;

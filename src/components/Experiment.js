import React from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";
import Beforeunload from "react-beforeunload";
import { reactLocalStorage } from "reactjs-localstorage";
import VideoQuestions from "./VideoQuestions";
import Instructions from "./Instructions";
import ContinuousGrid from "./ContinuousGridQuestions";

const StageEnum = {
  enterSubjectID: 0,
  instructions: 1,
  experiment: 2,
  betweenVids: 2.1,
  done: 3,
};
const INITIALSTATE = {
  restoredPos: 0,
  data: {},
  videoIndex: 0,
  nextTimepointIndex: 0,
  stage: StageEnum.enterSubjectID,
  showQuestionTime: 0,
  startTime: 0,
  elapsedTotalTime: 0,
  subjectID: "",
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
    const {
      videos,
      questions,
      paradigm,
      shuffleVideos,
      shuffleQuestions,
    } = this.props;
    // Parse csv timepoints
    const processedVids =
      paradigm === "consensus"
        ? videos.map((v) => ({
            ...v,
            timepoints: v.timepoints.split(",").map(Number),
          }))
        : videos;
    this.state = {
      shuffledVideos: shuffleVideos ? shuffle(processedVids) : processedVids,
      shuffledQuestions: shuffleQuestions ? shuffle(questions) : questions,
      ...INITIALSTATE,
      paused: paradigm === "continuous",
    };
  }

  // Add the new data point from VideoQuestions and resume the video
  onSubmit(newValue) {
    const { data, showQuestionTime } = this.state;
    const currentVideo = this.getCurrentVideo().id;
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
    console.log("onpause");
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
        stage: StageEnum.betweenVids,
        videoIndex: videoIndex + 1,
      });
    }
  }

  onProgress({ playedSeconds }) {
    const { paradigm } = this.props;
    if (paradigm === "consensus") {
      const { nextTimepointIndex } = this.state;
      if (
        playedSeconds > this.getCurrentVideo().timepoints[nextTimepointIndex]
      ) {
        this.setState((s) => ({
          paused: true,
          showQuestionTime: Date.now(),
          nextTimepointIndex: s.nextTimepointIndex + 1,
        }));
      }
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

    reactLocalStorage.setObject("var", save);
  }

  getCurrentVideo() {
    const { shuffledVideos, videoIndex } = this.state;
    return shuffledVideos[videoIndex];
  }

  getPlayerRef(ref) {
    this.player = ref;
  }

  // Send data up to server
  sendData() {
    const { data, startTime, elapsedTotalTime, subjectID } = this.state;
    const { sendData } = this.props;
    const dataWithBrowserInfo = {
      answers: data,
      browserWidth: Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      ),
      browserHeight: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ),
      videoWidth: this.player.wrapper.clientWidth,
      videoHeight: this.player.wrapper.clientHeight,
      totalDuration: (elapsedTotalTime + (Date.now() - startTime)) / 1000,
      subjectID,
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

  renderOverlayInstructions() {
    const { instructionsOverlay } = this.props;
    const { isInstructionOpen } = this.state;

    return (
      <>
        <div
          id="myNav"
          className="overlay"
          style={{ width: isInstructionOpen ? "100%" : "0%" }}
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
            <div>{instructionsOverlay}</div>
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
      </>
    );
  }

  handleClick() {
    this.setState({ paused: false });
  }

  renderExperiment() {
    const { paused } = this.state;
    const videoUrl = `https://vimeo.com/${this.getCurrentVideo().id}`;

    return (
      <div className="Video">
        <div>{this.renderOverlayInstructions()}</div>
        <div className="videoContainer">
          <ReactPlayer
            className="videoPlayer"
            ref={(r) => this.getPlayerRef(r)}
            url={videoUrl}
            onReady={() => this.onReady()}
            onPlay={() => this.onPlay()}
            onEnded={() => this.onVideoEnd()}
            onProgress={(e) => this.onProgress(e)}
            playing={!paused}
            width="100%"
            height="100%"
            config={{
              vimeo: {
                playerOptions: {
                  controls: false,
                },
              },
            }}
          />
        </div>
        <div className="questionContainer">{this.renderQuestions()}</div>
      </div>
    );
  }

  renderQuestions() {
    const { paused, shuffledQuestions } = this.state;
    const { paradigm } = this.props;
    if (paradigm === "continuous") {
      const { data } = this.state;
      const currentVideo = this.getCurrentVideo().id;
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
          onSubmit={(n) => this.onSubmit(n)}
          questions={shuffledQuestions}
          videoPos={this.player ? this.player.getCurrentTime() : 0}
        />
      );
    }
    if (paradigm === "self") {
      return (
        <div className="questionPlaceholder">
          Click pause and questions will appear here.
          <button id="pauseButton" onClick={() => this.onPause()} type="button">
            Pause
          </button>
        </div>
      );
    }
    if (paradigm === "consensus") {
      return (
        <div className="questionPlaceholder">
          The video will pause automatically and questions will appear here.
        </div>
      );
    }
  }

  renderBetweenVids() {
    return (
      <Instructions
        onFinish={() => this.setState({ stage: StageEnum.experiment })}
        instructionScreens={["Click next to watch the next video"]}
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
      case StageEnum.betweenVids:
        return this.renderBetweenVids();
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
          <button
            type="button"
            onClick={() => this.setState({ stage: StageEnum.instructions })}
          >
            {" "}
            Next &#8250;
          </button>
        </div>
      </div>
    );
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
  videos: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      timepoints: PropTypes.string,
    })
  ).isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  sendData: PropTypes.func.isRequired,
  instructionScreens: PropTypes.arrayOf(PropTypes.string).isRequired,
  instructionsOverlay: PropTypes.string.isRequired,
};

export default Experiment;

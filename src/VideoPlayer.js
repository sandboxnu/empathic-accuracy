import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import VideoQuestions from './VideoQuestions';
import { questionType } from './types';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPos: 0,
      justReset: false,
      paused: false,
      data: [],
    };
  }

  onPause() {
    this.setState({ paused: true });
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
    const { data } = this.state;
    this.setState({
      data: [...data, newValue],
      paused: false,
    });
  }

  getPlayerRef(ref) {
    this.player = ref;
  }

  render() {
    const { videoId, questions } = this.props;
    const { paused } = this.state;
    const videoUrl = `https://vimeo.com/${videoId}`;
    return (
      <div>
        <div id="opaqueLayer" />
        <ReactPlayer
          ref={r => this.getPlayerRef(r)}
          url={videoUrl}
          onPause={() => this.onPause()}
          onPlay={() => this.onPlay()}
          onProgress={p => this.onProgress(p)}
          onSeek={() => this.onSeek()}
        />
        {paused ? <VideoQuestions onSubmit={n => this.onSubmit(n)} questions={questions} /> : null}
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(questionType).isRequired,
};

export default VideoPlayer;

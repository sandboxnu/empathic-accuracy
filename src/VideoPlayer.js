import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import VideoQuestion from './VideoQuestion';
import { questionType } from './types';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false,
    };
  }

  onPause() {
    this.setState({ paused: true });
  }

  onPlay() {
    this.setState({ paused: false });
  }

  render() {
    const { videoId, questions } = this.props;
    const { paused } = this.state;
    const videoUrl = `https://vimeo.com/${videoId}`;
    return (
      <div>
        <ReactPlayer url={videoUrl} onPause={() => this.onPause()} onPlay={() => this.onPlay()} />
        {paused ? <VideoQuestion questions={questions} /> : null}
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(questionType).isRequired,
};

export default VideoPlayer;

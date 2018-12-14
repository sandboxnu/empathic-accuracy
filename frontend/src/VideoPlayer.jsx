import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import VideoQuestion from './VideoQuestion';

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
    const { videoId, question } = this.props;
    const { paused } = this.state;
    const videoUrl = `https://vimeo.com/${videoId}`;
    return (
      <div>
        <ReactPlayer url={videoUrl} onPause={() => this.onPause()} onPlay={() => this.onPlay()} />
        {paused ? <VideoQuestion question={question} /> : null}
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string,
  question: PropTypes.string,
};

VideoPlayer.defaultProps = {
  videoId: '121',
  question: 'Default question',
};

export default VideoPlayer;

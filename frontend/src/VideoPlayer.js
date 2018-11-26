import React from 'react';
import ReactPlayer from 'react-player';
import VideoQuestion from './VideoQuestion.js';
import PropTypes from 'prop-types';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false
    };
  }

  render() {
    let {videoId, question} = this.props;
    let videoUrl = `https://vimeo.com/${videoId}`;

    return (
      <div>
        <ReactPlayer
          url={videoUrl}
          onPause={()=>this._onPause()}
          onPlay={()=>this._onPlay()} />
        {this.state.paused ? <VideoQuestion question={question}> </VideoQuestion> : null}
      </div>
    );
  }

  _onPause() {
    this.setState({paused: true});
  }

  _onPlay() {
    this.setState({paused: false});
  }
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string,
  question: PropTypes.string
}

export default VideoPlayer;

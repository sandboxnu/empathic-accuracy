import React from 'react';
import VideoPlayer from './VideoPlayer.js'

class ExperimentRunner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: "",
      question: ""
    };
  }

  componentDidMount() {
    fetch('/api/experiment')
      .then(result => {
        return result.json();
      }).then(data => {
        this.setState(data);
      });

  }

  render() {
    return (
      <VideoPlayer
        videoId={this.state.videoId}
        question={this.state.question}/>
    );
  }
}

export default ExperimentRunner;

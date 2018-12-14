import React from 'react';
import fetch from 'whatwg-fetch';
import VideoPlayer from './VideoPlayer';

class ExperimentRunner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: '',
      question: '',
    };
  }

  componentDidMount() {
    fetch('/api/experiment')
      .then(result => result.json()).then((data) => {
        this.setState(data);
      });
  }

  render() {
    const { videoId, question } = this.state;
    return (
      <VideoPlayer
        videoId={videoId}
        question={question}
      />
    );
  }
}

export default ExperimentRunner;

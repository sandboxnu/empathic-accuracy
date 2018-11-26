import React from 'react';
import PropTypes from 'prop-types';

class VideoQuestion extends React.Component {
  render(){
    return (
      <div>{this.props.question}</div>
    );
  }
}

VideoQuestion.propTypes = {
    question: PropTypes.string
}

export default VideoQuestion;

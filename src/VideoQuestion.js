import React from 'react';
import PropTypes from 'prop-types';

function VideoQuestion(props) {
  const { question } = props;
  return <div>{question}</div>;
}

VideoQuestion.propTypes = {
  question: PropTypes.string,
};

VideoQuestion.defaultProps = {
  question: 'Default question',
};

export default VideoQuestion;

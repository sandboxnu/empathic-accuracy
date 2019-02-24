import React from 'react';
import Experiment from './Experiment';
import config from '../offlineConfig';

function generateID() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

/* In charge of talking to server */
function ExperimentOffline() {
  return (<Experiment {...config} completionID={generateID()} sendData={console.log} />);
}

export default ExperimentOffline;

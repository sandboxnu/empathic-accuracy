import React from "react";
import Experiment from "./Experiment";
import config from "./offlineConfig";

/* In charge of talking to server */
function ExperimentOffline() {
  return <Experiment {...config} sendData={console.log} />;
}

export default ExperimentOffline;

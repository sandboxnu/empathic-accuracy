import React from 'react';
import Fetch from 'react-fetch-component';
import VideoPlayer from './VideoPlayer';
import defaultConfig from './defaultConfig';

function ExperimentRunner() {
  return (
    <Fetch url="/api/experiment">
      {({ loading, error, data }) => (
        <div>
          {loading && <span>Loading...</span> }
          {data && <VideoPlayer {...data} />}
          {error && <VideoPlayer {... defaultConfig} />}
        </div>
      )}
    </Fetch>
  );
}

export default ExperimentRunner;

import React from 'react';
import Fetch from 'react-fetch-component';
import VideoPlayer from './VideoPlayer';

function ExperimentRunner() {
  return (
    <Fetch url="/api/experiment">
      {({ loading, error, data }) => (
        <div>
          {loading && <span>Loading...</span> }
          {data && <VideoPlayer {...data} />}
          {error && <span>Problem getting response from server!</span>}
        </div>
      )}
    </Fetch>
  );
}

export default ExperimentRunner;

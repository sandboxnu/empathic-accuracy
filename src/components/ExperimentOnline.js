import React from 'react';
import Fetch from 'react-fetch-component';
import Axios from 'axios';
import Experiment from './Experiment';

const SERVER_URL = 'https://api.sandboxneu.com/empathic-accuracy';

function sendData(collected) {
  const time = Math.floor(new Date().getTime() / 1000);
  const file = new File([JSON.stringify(collected)], `${time}.json`);

  const formData = new FormData();
  formData.append('file', file);

  // Using axios http lib to send post request with formdata.
  // fetch, xmlhttprequest, jquery etc. could also be used.
  Axios.post(`${SERVER_URL}/data`, formData)
    .then((response) => {
      console.log(response);
    })
    .catch(error => console.log(error));
}

/* In charge of talking to server */
function ExperimentOnline() {
  return (
    <Fetch url={`${SERVER_URL}/experiment`} as="json">
      {({ loading, error, data }) => (
        <div>
          {loading && <span>Loading...</span> }
          {data
              && <Experiment {...data} sendData={sendData} />}
          {error && <span>Server error</span>}
        </div>
      )}
    </Fetch>);
}

export default ExperimentOnline;

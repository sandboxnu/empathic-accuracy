import React from 'react';
import Fetch from 'react-fetch-component';
import Axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import Experiment from './Experiment';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://api.sandboxneu.com/empathic-accuracy';

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

function generateID() {
  const completionID = reactLocalStorage.get('completionID', Math.random().toString(36).substring(2, 12).toUpperCase());
  reactLocalStorage.set('completionID', completionID);
  return completionID;
}

/* In charge of talking to server */
function ExperimentOnline() {
  return (
    <Fetch url={`${SERVER_URL}/experiment`} as="json">
      {({ loading, error, data }) => {
        if (loading) {
          return <span>Loading...</span>;
        }
        if (data) {
          return <Experiment {...data} completionID={generateID()} sendData={sendData} />;
        }
        if (error) {
          return <span>Server error</span>;
        }
        return null;
      }
      }
    </Fetch>);
}

export default ExperimentOnline;

import React from 'react';
import Fetch from 'react-fetch-component';
import Axios from 'axios';
import Experiment from './Experiment';

const SERVER_URL = 'http://142.93.49.129:3000';

/* In charge of talking to server */
class ExperimentOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
    };
  }

  sendData(collected) {
    const time = Math.floor(new Date().getTime() / 1000);
    const file = new File([JSON.stringify(collected)], `${time}.json`);

    const formData = new FormData();
    formData.append('file', file);

    // Using axios http lib to send post request with formdata.
    // fetch, xmlhttprequest, jquery etc. could also be used.
    Axios.post(`${SERVER_URL}/data`, formData)
      .then((response) => {
        console.log(response);
        this.setState({ done: true });
      })
      .catch(error => console.log(error));
  }

  render() {
    const { done } = this.state;

    if (done) {
      return (<span>Thank you for participating. You can close this browser tab.</span>);
    }

    return (
      <Fetch url={`${SERVER_URL}/experiment`} as="json">
        {({ loading, error, data }) => (
          <div>
            {loading && <span>Loading...</span> }
            {data && <Experiment {...data} sendData={(collected) => { this.sendData(collected); }} />}
            {error && <span>Server error</span>}
          </div>
        )}
      </Fetch>
    );
  }
}

export default ExperimentOnline;

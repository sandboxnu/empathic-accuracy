import React, { Component } from 'react';
import Form from 'react-jsonschema-form-bs4';
import Fetch from 'react-fetch-component';
import Axios from 'axios';
import Beforeunload from 'react-beforeunload';
import schema from '../configSchema';
import uiSchema from '../configUISchema';

const SERVER_URL = 'https://api.sandboxneu.com/empathic-accuracy';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configOnServer: {},
      formData: {},
    };
  }

  onSubmit({ formData }) {
    const file = new File([JSON.stringify(formData)], 'config.json');

    const form = new FormData();
    form.append('file', file);
    Axios.post(`${SERVER_URL}/experiment`, form)
      .then(() => this.setState({ configOnServer: formData }))
      .catch(error => console.log(error));
  }

  onChange({ formData }) {
    this.setState({
      formData,
    });
  }

  onServerData(data) {
    this.setState({
      configOnServer: data,
      formData: data,
    });
  }

  onClose(e) {
    const { configOnServer, formData } = this.state;
    if (JSON.stringify(configOnServer) !== JSON.stringify(formData)) {
      return e.preventDefault();
    }
    return null;
  }

  renderPanel() {
    const { formData } = this.state;
    return (
      <div className="container">
        <h2>Download collected data</h2>
        <a href={`${SERVER_URL}/data`} rel="noopener noreferrer" target="_blank">Download collected data</a>
        <h2>Configure Experiment</h2>
        <Form
          className="configForm"
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onChange={f => this.onChange(f)}
          onSubmit={f => this.onSubmit(f)}
        />
      </div>
    );
  }

  render() {
    return (
      <Beforeunload onBeforeunload={e => this.onClose(e)}>
        <Fetch url={`${SERVER_URL}/experiment`} as="json" onDataChange={d => this.onServerData(d)}>
          {() => this.renderPanel()}
        </Fetch>
      </Beforeunload>
    );
  }
}

export default AdminPanel;

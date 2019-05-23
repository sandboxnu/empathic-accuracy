/* eslint-disable no-undef */
import React, { Component } from 'react';
import SchemaForm from 'react-jsonschema-form-bs4';
import Fetch from 'react-fetch-component';
import Axios from 'axios';
import Beforeunload from 'react-beforeunload';
import fileDownload from 'js-file-download';
import schema from '../configSchema';
import uiSchema from '../configUISchema';
import Login from './Login';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://api.sandboxneu.com/production-empathic';

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configOnServer: {},
      formData: {},
      authenticated: false,
      password: null,
    };
  }

  onSubmit({ formData }) {
    const file = new File([JSON.stringify(formData)], 'config.json');

    const { password } = this.state;
    const form = new FormData();
    form.append('file', file);
    Axios.post(`${SERVER_URL}/experiment`, form, {
      auth: {
        username: '',
        password,
      },
    }).then(() => this.setState({ configOnServer: formData }))
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
      e.preventDefault();
      return 'You have unsaved changes';
    }
    return null;
  }

  onPassword(password) {
    this.setState({
      authenticated: true,
      password,
    });
  }

  downloadData() {
    const { password } = this.state;
    Axios.get(`${SERVER_URL}/data`, {
      auth: {
        username: '',
        password,
      },
    }).then(data => fileDownload(data.data, 'data.zip'))
      .catch(error => console.log(error));
  }

  renderPanel() {
    const { formData } = this.state;
    return (
      <div className="panel container">
        <h2>Download collected data</h2>
        <button onClick={() => { this.downloadData(); }} type="button" className="btn btn-primary">
          <i className="fas fa-download" />
          {' '}
          Download collected data
        </button>
        <h2>Configure Experiment</h2>
        <SchemaForm
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
    const { authenticated } = this.state;
    if (!authenticated) {
      return <Login onPassword={p => this.onPassword(p)} />;
    }
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

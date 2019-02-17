import React from 'react';
import Form from 'react-jsonschema-form-bs4';
import Fetch from 'react-fetch-component';
import Axios from 'axios';
import schema from '../configSchema';
import uiSchema from '../configUISchema';

const SERVER_URL = 'https://api.sandboxneu.com/empathic-accuracy';
const log = type => console.log.bind(console, type);

const onSubmit = ({ formData }) => {
  const file = new File([JSON.stringify(formData)], 'config.json');

  const form = new FormData();
  form.append('file', file);
  Axios.post(`${SERVER_URL}/experiment`, form)
    .then(response => console.log(response))
    .catch(error => console.log(error));
};

function AdminPanel() {
  return (
    <Fetch url={`${SERVER_URL}/experiment`} as="json">
      {({ data }) => (
        <div className="container">
          <h2>Download collected data</h2>
          <a href={`${SERVER_URL}/data`} rel="noopener noreferrer" target="_blank">Download collected data</a>
          <h2>Configure Experiment</h2>
          <Form
            className="configForm"
            schema={schema}
            uiSchema={uiSchema}
            formData={data}
            onChange={log('changed')}
            onSubmit={onSubmit}
            onError={log('errors')}
          />
        </div>
      )}
    </Fetch>
  );
}

export default AdminPanel;

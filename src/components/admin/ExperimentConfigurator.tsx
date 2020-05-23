/* eslint-disable no-undef */
import React, { useState, SyntheticEvent } from "react";
import SchemaForm from "react-jsonschema-form-bs4";
import Axios from "axios";
import { isEqual } from "lodash";
import Beforeunload from "react-beforeunload";
import fileDownload from "js-file-download";
import schema from "./configSchema";
import uiSchema from "./configUISchema";
import { ExperimentConfig } from "lib/types";
import { useAxios } from "lib/useAxios";

interface ExperimentConfiguratorProps {
  experimentId: number;
}
export default function ExperimentConfigurator({
  experimentId,
}: ExperimentConfiguratorProps) {
  const experimentURL = `api/experiment/${experimentId}`;
  const [config, setConfig] = useState<ExperimentConfig>();
  const [configOnServer, setConfigOnServer] = useState<ExperimentConfig>(
    config
  ); // For warning user closing tab

  useAxios(
    experimentURL,
    (data) => {
      setConfig(data);
      setConfigOnServer(data);
    },
    [setConfig, setConfigOnServer]
  );

  function submitNewConfig(newConf: ExperimentConfig) {
    Axios.post(experimentURL, newConf)
      .then(() => setConfigOnServer(newConf))
      .catch((error) => console.log(error));
  }

  function downloadExperimentData() {
    Axios.get(`${experimentURL}/data`, { responseType: "arraybuffer" })
      .then(({ data }) =>
        fileDownload(data, `experiment_${experimentId}_data.json`)
      )
      .catch((error) => console.log(error));
  }

  function onClose(e: SyntheticEvent) {
    if (!isEqual(configOnServer, config)) {
      e.preventDefault();
      return "You have unsaved changes";
    }
    return null;
  }

  return (
    <Beforeunload onBeforeunload={onClose}>
      <div className="panel container">
        <h2>Download collected data</h2>
        <button
          onClick={downloadExperimentData}
          type="button"
          className="btn btn-primary"
        >
          <i className="fas fa-download" /> Download collected data
        </button>
        <h2>Configure Experiment</h2>
        <SchemaForm
          className="configForm"
          schema={schema}
          uiSchema={uiSchema}
          formData={config}
          onChange={({ formData }) => setConfig(formData)}
          onSubmit={({ formData }) => submitNewConfig(formData)}
        />
      </div>
    </Beforeunload>
  );
}

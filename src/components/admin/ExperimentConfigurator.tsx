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

// rawconfig is used by formschema and must be transformed before upload
// difference timepoints are comma separated string
interface RawConfig extends Omit<ExperimentConfig, "videos"> {
  videos: { id: string; timepoints?: string }[];
}
export default function ExperimentConfigurator({
  experimentId,
}: ExperimentConfiguratorProps) {
  const experimentURL = `api/experiment/${experimentId}`;
  const [config, setConfig] = useState<RawConfig>();
  const [configOnServer, setConfigOnServer] = useState<RawConfig>(); // For warning user closing tab

  useAxios(
    experimentURL,
    (data: ExperimentConfig) => {
      const raw: RawConfig = {
        ...data,
        videos: data.videos.map((v) => ({
          ...v,
          timepoints: v.timepoints.join(","),
        })),
      };
      setConfig(raw);
      setConfigOnServer(raw);
    },
    [setConfig, setConfigOnServer]
  );

  function submitNewConfig(newConf: RawConfig) {
    const exConf: ExperimentConfig = {
      ...newConf,
      videos: newConf.videos.map((v) => ({
        ...v,
        timepoints: v.timepoints ? v.timepoints.split(",").map(Number) : [],
      })),
    };
    Axios.post(experimentURL, exConf)
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

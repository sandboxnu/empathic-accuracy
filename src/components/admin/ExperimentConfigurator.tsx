/* eslint-disable no-undef */
import React, { useState } from "react";
import SchemaForm from "react-jsonschema-form-bs4";
import Axios from "axios";
import { isEqual } from "lodash";
import { useBeforeunload } from "react-beforeunload";
import schema from "./configSchema";
import uiSchema from "./configUISchema";
import { ExperimentConfig } from "lib/types";
import { useAxios } from "lib/useAxios";
import { downloadExperimentData } from "lib/downloadData";
import { Spinner, Navbar, FormControl, Form, Button } from "react-bootstrap";
import {
  SetExperimentParams,
  GetExperimentResponse,
} from "pages/api/experiment/[exId]";
import Link from "next/link";

interface ExperimentConfiguratorProps {
  experimentId: string;
}

// rawconfig is used by formschema and must be transformed before upload
// difference timepoints are comma separated string
interface RawConfig extends Omit<ExperimentConfig, "videos"> {
  videos: { id: string; timepoints?: string }[];
}
export default function ExperimentConfigurator({
  experimentId,
}: ExperimentConfiguratorProps) {
  const experimentURL = `/api/experiment/${experimentId}`;
  const [nickname, setNickname] = useState("");
  const [config, setConfig] = useState<RawConfig>();
  const [configOnServer, setConfigOnServer] = useState<RawConfig>(); // For warning user closing tab

  useAxios(
    experimentURL,
    (data: GetExperimentResponse) => {
      const raw: RawConfig = {
        ...data.config,
        videos: data.config.videos.map((v) => ({
          ...v,
          timepoints: v.timepoints.join(","),
        })),
      };
      setConfig(raw);
      setConfigOnServer(raw);
      setNickname(data.nickname);
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
    const newExp: SetExperimentParams = {
      nickname: nickname,
      config: exConf,
    };
    Axios.post(experimentURL, newExp)
      .then(() => setConfigOnServer(newConf))
      .catch((error) => console.log(error));
  }

  useBeforeunload((e) => {
    if (!isEqual(configOnServer, config)) {
      e.preventDefault();
      return "You have unsaved changes";
    }
    return null;
  });

  return (
    <div className="panel container">
      <Navbar sticky="top" bg="light" className="shadow-sm">
        <Link href="/admin">
          <a>
            <i className="fas fa-arrow-left mr-4" />
          </a>
        </Link>
        <Form
          inline
          onSubmit={(e: React.FormEvent) => e.preventDefault()}
          className="flex-grow-1"
        >
          <span className="mr-2">Nickname:</span>
          <FormControl
            type="text"
            placeholder="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.currentTarget.value)}
          />
          <Button
            variant="secondary"
            onClick={() => downloadExperimentData(experimentId)}
            className="ml-auto"
          >
            <span className="mr-2">Download Data</span>
            <i className="fas fa-download" />
          </Button>
        </Form>
      </Navbar>
      <h2>Configure Experiment</h2>
      {config ? (
        <SchemaForm
          className="configForm"
          schema={schema}
          uiSchema={uiSchema}
          formData={config}
          onChange={({ formData }) => setConfig(formData)}
          onSubmit={({ formData }) => submitNewConfig(formData)}
        />
      ) : (
        <Spinner role="status" animation="border" />
      )}
    </div>
  );
}

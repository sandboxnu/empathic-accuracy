import React, { useState } from "react";
import SchemaForm from "react-jsonschema-form-bs4";
import Axios from "axios";
import { useBeforeunload } from "react-beforeunload";
import schema from "lib/config/configSchema";
import uiSchema from "lib/config/configUISchema";
import { ExperimentConfig, TrialBlockConfig } from "lib/types";
import { useAxios } from "lib/useAxios";
import { downloadExperimentData } from "lib/downloadData";
import {
  Spinner,
  Navbar,
  FormControl,
  Form,
  Button,
  Container,
  Toast,
  Modal,
} from "react-bootstrap";
import {
  SetExperimentParams,
  GetExperimentResponse,
} from "pages/api/experiment/[exId]";
import Link from "next/link";
import { useRouter } from "next/router";
import GatedButton from "components/GatedButton";

interface ExperimentConfiguratorProps {
  experimentId: string;
}

type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

// rawconfig is used by formschema and must be transformed before upload
// difference timepoints are comma separated string
type RawTrialBlockConfig = DistributiveOmit<TrialBlockConfig, "videos"> & {
  videos: { id: string; timepoints?: string }[];
};

type RawConfig = Omit<ExperimentConfig, "trialBlocks"> & {
  trialBlocks: RawTrialBlockConfig[];
};

export default function ExperimentConfigurator({
  experimentId,
}: ExperimentConfiguratorProps) {
  const experimentURL = `/api/experiment/${experimentId}`;
  const [nickname, setNickname] = useState("");
  const [config, setConfig] = useState<RawConfig>();
  const [isUnsaved, setIsUnsaved] = useState(false);

  const [showSaved, setShowSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useAxios(
    experimentURL,
    (data: GetExperimentResponse) => {
      const raw: RawConfig = {
        ...data.config,
        trialBlocks: data.config.trialBlocks.map((t) => ({
          ...t,
          videos: t.videos.map((v) => ({
            ...v,
            timepoints: v.timepoints.join(","),
          })),
        })),
      };
      setConfig(raw);
      setNickname(data.nickname);
      setIsUnsaved(false);
    },
    [setConfig, setNickname]
  );

  function save(newConf: RawConfig, newNickname: string) {
    const exConf: ExperimentConfig = {
      ...newConf,
      trialBlocks: newConf.trialBlocks.map((t) => ({
        ...t,
        videos: t.videos.map((v) => ({
          ...v,
          timepoints: v.timepoints ? v.timepoints.split(",").map(Number) : [],
        })),
      })),
    };
    const newExp: SetExperimentParams = {
      nickname: newNickname,
      config: exConf,
    };
    setIsUnsaved(false);
    Axios.post(experimentURL, newExp)
      .then(() => setShowSaved(true))
      .catch((error) => {
        setIsUnsaved(true);
        console.log(error);
      });
  }

  useBeforeunload((e) => {
    if (isUnsaved) {
      e.preventDefault();
      return "You have unsaved changes";
    }
    return null;
  });

  return (
    <>
      <Navbar sticky="top" bg="light" className="shadow-sm">
        <Link href="/admin">
          <a
            onClick={(e) => {
              if (isUnsaved) {
                e.preventDefault();
                setShowModal(true);
              }
            }}
          >
            <i className="fas fa-arrow-left mr-4" />
          </a>
        </Link>
        <Form
          onSubmit={(e: React.FormEvent) => e.preventDefault()}
          className="flex-grow-1 d-flex"
        >
          <span className="mr-2">Nickname:</span>
          <FormControl
            type="text"
            value={nickname}
            onChange={(e) => {
              setIsUnsaved(true);
              setNickname(e.currentTarget.value);
            }}
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
      <Container className="mt-3 pb-5">
        <h2>Configure Experiment</h2>
        {config ? (
          <SchemaForm
            className="configForm"
            schema={schema}
            uiSchema={uiSchema}
            formData={config}
            onChange={({ formData }) => {
              setIsUnsaved(true);
              setConfig(formData);
            }}
            onSubmit={({ formData }) => save(formData, nickname)}
          >
            <GatedButton
              type="submit"
              tooltip="All changes saved!"
              disabled={!isUnsaved}
            >
              Save
            </GatedButton>
          </SchemaForm>
        ) : (
          <Spinner role="status" animation="border" />
        )}
      </Container>
      <Toast
        autohide
        delay={3000}
        onClose={() => setShowSaved(false)}
        show={showSaved}
        style={{ position: "fixed", right: 20, bottom: 20 }}
      >
        <Toast.Body>
          <i className="fas fa-save mr-2" />
          Saved experiment configuration!
        </Toast.Body>
      </Toast>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to save changes?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{"Your changes will be lost if you don't save them"}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="mr-auto"
            variant="secondary"
            onClick={() => router.back()}
          >
            {"Don't Save"}
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              save(config as RawConfig, nickname);
              router.back();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

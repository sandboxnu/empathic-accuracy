import React, { useState } from "react";
import Axios from "axios";
import { useAxios } from "lib/useAxios";
import { useRouter } from "next/router";
import ExperimentRunner from "components/ExperimentRunner";
import { ExperimentConfig, ExperimentDataEntry } from "lib/types";
import { GetExperimentResponse } from "pages/api/experiment/[exId]";

export default function ExperimentPage() {
  const router = useRouter();
  const experimentId = router.query.exId;
  const experimentURL = `/api/experiment/${experimentId}`;

  const [config, setConfig] = useState<ExperimentConfig>();

  useAxios(experimentURL, (a: GetExperimentResponse) => setConfig(a.config), [
    setConfig,
  ]);

  function sendData(collected: ExperimentDataEntry) {
    Axios.post(`${experimentURL}/data`, collected)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="App">
      {config && <ExperimentRunner config={config} sendData={sendData} />}
    </div>
  );
}

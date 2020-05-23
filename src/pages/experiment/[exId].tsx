import React, { useState } from "react";
import Axios from "axios";
import { useAxios } from "lib/useAxios";
import { useRouter } from "next/router";
import ExperimentRunner from "components/ExperimentRunner";
import { ExperimentConfig } from "lib/types";

export default function ExperimentPage() {
  const router = useRouter();
  const experimentId = router.query.exId;
  const experimentURL = `/api/experiment/${experimentId}`;

  const [config, setConfig] = useState<ExperimentConfig>();

  useAxios(experimentURL, (data) => setConfig(data), [setConfig]);

  function sendData(collected) {
    Axios.post(`${experimentURL}/data`, collected)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="App">
      {config && <ExperimentRunner {...config} sendData={sendData} />}
    </div>
  );
}

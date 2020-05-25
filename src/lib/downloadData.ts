import Axios from "axios";
import fileDownload from "js-file-download";

export function downloadExperimentData(exId: string) {
  Axios.get(`/api/experiment/${exId}/data`, { responseType: "arraybuffer" })
    .then(({ data }) => fileDownload(data, `experiment_${exId}_data.json`))
    .catch((error) => console.log(error));
}

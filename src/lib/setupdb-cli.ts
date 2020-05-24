import { setupTable, setConfig } from "./db";
import sampleConfig from "./sampleConfig.json";
import { ExperimentConfig } from "./types";

if (require.main === module) {
  (async () => {
    await setupTable();
    console.log("created table");
    await setConfig(1, sampleConfig as ExperimentConfig);
    console.log("setup experiment 1 with sample data");
  })().catch(console.error);
}

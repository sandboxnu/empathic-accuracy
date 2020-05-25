import { setupTable, createExperiment } from "./db";

if (require.main === module) {
  (async () => {
    await setupTable();
    console.log("created table");
    await createExperiment();
    console.log("setup experiment 1 with sample data");
  })().catch(console.error);
}

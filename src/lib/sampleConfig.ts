import { ExperimentConfig } from "./types";

const sampleConfig: ExperimentConfig = {
  videos: [{ id: "364433873/a557aecc20", timepoints: [] }],
  shuffleVideos: true,
  instructionScreens: ["In this task, you will be shown a few videos."],
  instructionsOverlay: "",
  paradigm: "self",
  completionLink: "",
  questions: [
    {
      type: "scale",
      label: "Label the emotion",
      choices: ["Valence", "Arousal", "dominance"],
    },
  ],
  shuffleQuestions: true,
};

export default sampleConfig;

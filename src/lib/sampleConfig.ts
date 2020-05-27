import { ExperimentConfig } from "./types";

const sampleConfig: ExperimentConfig = {
  videos: [{ id: "364433873/a557aecc20", timepoints: [] }],
  shuffleVideos: true,
  instructions: {
    instructionScreens: ["In this task, you will be shown a few videos."],
    instructionsOverlay: "",
    pauseInstructions: "Pause the video at emotional events",
  },
  paradigm: "self",
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

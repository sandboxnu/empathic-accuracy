import { ExperimentConfig } from "../types";

const sampleConfig: ExperimentConfig = {
  shuffleTrialBlocks: true,
  trialBlocks: [
    {
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
      testTrial: {
        enabled: true,
        maxTries: 2,
        minSegments: 2,
        failMessage:
          "You did not segment the video enough and are not eligible to continue",
      },
    },
  ],
};

export default sampleConfig;

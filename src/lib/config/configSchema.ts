import { JSONSchema6 } from "json-schema";
const trialBlock: JSONSchema6 = {
  type: "object",
  required: [],
  properties: {
    testTrial: {
      type: "object",
      title: "Test Trial Config",
      properties: {
        enabled: {
          type: "boolean",
          title: "Run test trial",
          description:
            "When selected, this trial will be preceded by a test trial that will not be recorded.",
          default: false,
        },
      },
    },
    instructions: {
      type: "object",
      title: "Customize Instructions",
      description: "Markdown: *italics*, **bold**",
      properties: {
        instructionScreens: {
          type: "array",
          title: "Instruction screens",
          items: {
            type: "string",
            title: "",
          },
          default: [
            "Welcome to the empathy study, and thanks for participating! On the following screen, you will see more instructions on what you will be asked to do.",
            "In this study, you will be shown a video and asked a set of questions about the video. You can answer these questions at any point. To be shown the questions, just pause the video. Click next to continue to the experiment.",
          ],
        },
        instructionsOverlay: {
          type: "string",
          title: "Overlay help instructions during experiment",
          default: "insert instructions here",
        },
      },
    },
    videos: {
      type: "array",
      title: "Vimeo Video IDs",
      items: {
        type: "object",
        title: "",
        properties: {
          id: {
            type: "string",
          },
        },
      },
      default: [{ id: "314909286/3623e43bae" }],
    },
    shuffleVideos: {
      type: "boolean",
      title: "Shuffle Order Videos Are Shown",
      default: true,
    },
    paradigm: {
      type: "string",
      title: "Data Collection Paradigm",
      enum: ["self", "consensus", "continuous", "timestamp"],
      default: "self",
    },
  },
  dependencies: {
    paradigm: {
      oneOf: [
        {
          properties: {
            paradigm: {
              enum: ["continuous"],
            },
            grid: {
              type: "object",
              title: "Grid Settings",
              properties: {
                dimensions: {
                  type: "number",
                  title: "Grid dimensions",
                  enum: [1, 2],
                  default: 1,
                },
                label: {
                  type: "string",
                  title: "Instruction text shown above the Affect Grid",
                  default: "",
                },
              },
              required: ["dimensions", "label"],
              dependencies: {
                dimensions: {
                  oneOf: [
                    {
                      properties: {
                        dimensions: { enum: [1] },
                        axis: {
                          $ref: "#/definitions/axis",
                        },
                      },
                    },
                    {
                      properties: {
                        dimensions: { enum: [2] },
                        xAxis: {
                          $ref: "#/definitions/axis",
                        },
                        yAxis: {
                          $ref: "#/definitions/axis",
                        },
                      },
                    },
                  ],
                },
              },
            },
            testTrial: {
              dependencies: {
                enabled: {
                  oneOf: [
                    {
                      properties: {
                        enabled: { enum: [false] },
                      },
                    },
                    {
                      properties: {
                        enabled: { enum: [true] },
                        video: {
                          type: "object",
                          title: "",
                          properties: {
                            id: {
                              type: "string",
                              title: "test trial video id",
                            },
                          },
                        },
                        maxSeconds: {
                          type: "number",
                          title: "Maximum seconds between mouse movements",
                          default: 30,
                        },
                        maxTries: {
                          type: "number",
                          title: "Number of test trials allowed",
                          default: 2,
                        },
                        successMessage: {
                          type: "string",
                          title: "message to show when test trial succeeds",
                        },
                        tryAgainMessage: {
                          type: "string",
                          title:
                            "message to show when test trial is failed and they must try again",
                        },
                        failMessage: {
                          type: "string",
                          title:
                            "message to show when test trial is failed too many times",
                        },
                      },
                      required: [
                        "video",
                        "maxSeconds",
                        "maxTries",
                        "successMessage",
                        "tryAgainMessage",
                        "failMessage",
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          properties: {
            paradigm: {
              enum: ["timestamp"],
            },
            timestampPrompt: {
              type: "object",
              title: "Instruction Configurations",
              properties: {
                buttonInstructions: {
                  type: "string",
                  title: "Instruction text shown between timepoints",
                  default: "Click the button at emotional events",
                },
                buttonText: {
                  type: "string",
                  title: "Text to show inside the button",
                  default: "Click",
                }
              },
            },
            testTrial: {
              dependencies: {
                enabled: {
                  oneOf: [
                    {
                      properties: {
                        enabled: { enum: [false] },
                      },
                    },
                    {
                      properties: {
                        enabled: { enum: [true] },
                        video: {
                          type: "object",
                          title: "",
                          properties: {
                            id: {
                              type: "string",
                              title: "test trial video id",
                            },
                          },
                        },
                        minSegments: {
                          type: "number",
                          title:
                            "Minimum number of segments needed to pass test trial",
                        },
                        maxTries: {
                          type: "number",
                          title: "Number of test trials allowed",
                          default: 3,
                        },
                        successMessage: {
                          type: "string",
                          title: "message to show when test trial succeeds",
                        },
                        tryAgainMessage: {
                          type: "string",
                          title:
                            "message to show when test trial is failed and they must try again",
                        },
                        failMessage: {
                          type: "string",
                          title:
                            "message to show when test trial is failed too many times",
                        },
                      },
                      required: [
                        "video",
                        "minSegments",
                        "maxTries",
                        "successMessage",
                        "tryAgainMessage",
                        "failMessage",
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          properties: {
            paradigm: {
              enum: ["self"],
            },
            questions: {
              $ref: "#/definitions/questions",
            },
            shuffleQuestions: {
              type: "boolean",
              title: "Shuffle Order Questions Are Shown",
              default: true,
            },
            instructions: {
              type: "object",
              title: "Instruction Configurations",
              properties: {
                pauseInstructions: {
                  type: "string",
                  title: "Instruction text shown between timepoints",
                  default: "Pause the video at emotional events",
                },
              },
            },
            testTrial: {
              dependencies: {
                enabled: {
                  oneOf: [
                    {
                      properties: {
                        enabled: { enum: [false] },
                      },
                    },
                    {
                      properties: {
                        enabled: { enum: [true] },
                        video: {
                          type: "object",
                          title: "",
                          properties: {
                            id: {
                              type: "string",
                              title: "test trial video id",
                            },
                          },
                        },
                        minSegments: {
                          type: "number",
                          title:
                            "Minimum number of segments needed to pass test trial",
                        },
                        maxTries: {
                          type: "number",
                          title: "Number of test trials allowed",
                          default: 3,
                        },
                        successMessage: {
                          type: "string",
                          title: "message to show when test trial succeeds",
                        },
                        tryAgainMessage: {
                          type: "string",
                          title:
                            "message to show when test trial is failed and they must try again",
                        },
                        failMessage: {
                          type: "string",
                          title:
                            "message to show when test trial is failed too many times",
                        },
                      },
                      required: [
                        "video",
                        "minSegments",
                        "maxTries",
                        "successMessage",
                        "tryAgainMessage",
                        "failMessage",
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          properties: {
            paradigm: {
              enum: ["consensus"],
            },
            videos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timepoints: {
                    type: "string",
                    title: "timepoints (comma separated seconds)",
                  },
                },
              },
            },
            questions: {
              $ref: "#/definitions/questions",
            },
            shuffleQuestions: {
              type: "boolean",
              title: "Shuffle Order Questions Are Shown",
              default: true,
            },
            instructions: {
              type: "object",
              properties: {
                pauseInstructions: {
                  type: "string",
                  title: "Instruction text shown between timepoints",
                  default:
                    "The video will pause automatically and questions will appear here.",
                },
              },
            },
            testTrial: {
              dependencies: {
                enabled: {
                  oneOf: [
                    {
                      properties: {
                        enabled: { enum: [false] },
                      },
                    },
                    {
                      properties: {
                        enabled: { enum: [true] },
                        successMessage: {
                          type: "string",
                          title: "message to show when test trial succeeds",
                        },
                        video: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              title: "test trial video id",
                            },
                            timepoints: {
                              type: "string",
                              title: "timepoints (comma separated seconds)",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    },
  },
};
const configSchema: JSONSchema6 = {
  type: "object",
  properties: {
    trialBlocks: {
      type: "array",
      title: "Trial Blocks",
      items: trialBlock,
    },
    shuffleTrialBlocks: {
      type: "boolean",
      title: "Shuffle Order Trial Blocks Are Shown",
    },
  },
  definitions: {
    questions: {
      type: "array",
      title: "Questions",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            title: "Type of Question",
            anyOf: [
              {
                type: "string",
                title: "Multiple Choice",
                enum: ["mc"],
              },
              {
                type: "string",
                title: "Rating Scale",
                enum: ["scale"],
              },
              {
                type: "string",
                title: "Affect Grid",
                enum: ["grid"],
              },
              {
                type: "string",
                title: "Open Response",
                enum: ["open"],
              },
            ],
            default: "mc",
          },
          label: { type: "string", title: "Question Label" },
        },
        dependencies: {
          type: {
            oneOf: [
              {
                properties: {
                  type: {
                    enum: ["mc"],
                  },
                  choices: {
                    type: "array",
                    title: "Answer Choices",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
              {
                properties: {
                  type: {
                    enum: ["scale"],
                  },
                  choices: {
                    type: "array",
                    title: "Scale Label",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
              {
                properties: { type: { enum: ["open"] } },
              },
              {
                properties: { type: { enum: ["grid"] } },
              },
            ],
          },
        },
      },
    },
    axis: {
      type: "object",
      properties: {
        high: { type: "string", title: "upper label" },
        low: { type: "string", title: "lower label" },
      },
      required: ["high", "low"],
    },
  },
};

export default configSchema;

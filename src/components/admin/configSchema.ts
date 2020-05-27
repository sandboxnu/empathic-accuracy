import { JSONSchema6 } from "json-schema";
const configSchema: JSONSchema6 = {
  type: "object",
  required: [],
  properties: {
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
    paradigm: {
      type: "string",
      title: "Data Collection Paradigm",
      enum: ["self", "consensus", "continuous"],
      default: "self",
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
  },
  dependencies: {
    paradigm: {
      oneOf: [
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
          },
        },
      ],
    },
  },
};

export default configSchema;

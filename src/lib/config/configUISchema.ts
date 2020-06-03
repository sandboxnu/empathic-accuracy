import { UiSchema } from "react-jsonschema-form-bs4";

const configUISchema: UiSchema = {
  "ui:order": ["paradigm", "*"],
  trialBlocks: {
    instructions: {
      instructionScreens: {
        items: {
          "ui:widget": "textarea",
        },
      },
      instructionsOverlay: {
        "ui:widget": "textarea",
      },
      pauseInstructions: {
        "ui:widget": "textarea",
      },
    },
  },
};

export default configUISchema;

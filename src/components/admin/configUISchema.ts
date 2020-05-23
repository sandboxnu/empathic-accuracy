import { UiSchema } from "react-jsonschema-form-bs4";

const configUISchema: UiSchema = {
  "ui:order": ["paradigm", "*", "completionLink"],
  videoIds: {
    "ui:options": {
      orderable: false,
    },
  },
  instructionScreens: {
    items: {
      "ui:widget": "textarea",
    },
  },
};

export default configUISchema;

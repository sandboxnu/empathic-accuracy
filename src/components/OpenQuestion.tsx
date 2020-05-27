import React from "react";
import { TextArea } from "informed";
import { OpenQuestion as OpenQuestionProps, QuestionBaseProp } from "lib/types";

export default function OpenQuestion({
  id,
  label,
}: OpenQuestionProps & QuestionBaseProp) {
  return (
    <div>
      <label className="questionTitle" htmlFor={id}>
        {label}
      </label>
      <br />
      <TextArea
        id={id}
        field={id}
        className="OpenQuestion"
        placeholder="Add your response here."
      />
    </div>
  );
}

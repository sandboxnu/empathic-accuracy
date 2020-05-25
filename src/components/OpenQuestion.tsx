import React from "react";
import { TextArea } from "informed";
import { OpenQuestion as OpenQuestionProps } from "lib/types";

export default function OpenQuestion({ id, label }: OpenQuestionProps) {
  return (
    <div>
      <label className="questionTitle" htmlFor={id}>
        {label}
      </label>
      <br />
      <TextArea
        id={id}
        field={id}
        cols="30"
        rows="5"
        className="OpenQuestion"
        placeholder="Add your response here."
      />
    </div>
  );
}

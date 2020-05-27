import React from "react";
import { RadioGroup, Radio } from "informed";
import {
  ScaleQuestion as ScaleQuestionProps,
  QuestionBaseProp,
} from "lib/types";

export default function ScaleQuestion({
  id,
  label,
  choices,
}: ScaleQuestionProps & QuestionBaseProp) {
  return (
    <div>
      <label className="questionTitle" htmlFor={id}>
        {label}
      </label>
      <RadioGroup id={id} field={id}>
        <ul className="likert">
          {choices.map((choice: string, idx: number) => {
            const choiceId = `radio${id}-${idx}`;
            return (
              <li key={choiceId}>
                <Radio id={choiceId} name="likert" value={choice} />
                <label htmlFor={choiceId}>{choice}</label>
              </li>
            );
          })}
        </ul>
      </RadioGroup>
    </div>
  );
}

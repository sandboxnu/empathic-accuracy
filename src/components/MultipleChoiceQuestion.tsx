import React from "react";
import { RadioGroup, Radio } from "informed";
import { MCQuestion } from "lib/types";

export default function MultipleChoiceQuestion({
  id,
  label,
  choices,
}: MCQuestion) {
  return (
    <div>
      <label className="questionTitle" htmlFor={id}>
        {label}
      </label>
      <RadioGroup id={id} field={id}>
        {choices.map((choice: string, idx: number) => {
          const choiceId = `radio${id}-${idx}`;
          return (
            <>
              <br />
              <Radio key={choiceId} value={choice} id={choiceId} />
              <label key={`label${choiceId}`} htmlFor={choiceId}>
                {choice}
              </label>
            </>
          );
        })}
      </RadioGroup>
    </div>
  );
}

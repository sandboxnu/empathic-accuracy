import React from "react";
import { TextArea } from "informed";
import { openQuestionType } from "../types";

class OpenQuestion extends React.Component {
  render() {
    const { id, label } = this.props;
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
}

OpenQuestion.propTypes = openQuestionType;

export default OpenQuestion;

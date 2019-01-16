import React from 'react';


// Show a series of instructions in page/slideshow format.
class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      // TODO keep track of which page in the instructions we're at.
    };
  }

  render() {
    // TODO actually render instructions
    // TODO render instructions based on props
    // TODO when last slide of instructions is reached, call this.props.onFinish()
    return (<div>hi</div>);
  }
}

export default Instructions;

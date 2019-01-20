import React from 'react';
import PropTypes from 'prop-types';


// Show a series of instructions in page/slideshow format.
class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      section: 0,
    };
  }

  navigateForward() {
    const { section } = this.state;
    const { instructionScreens, onFinish } = this.props;
    if (section === instructionScreens.length - 1) {
      onFinish();
    } else {
      this.setState({ section: section + 1 });
    }
  }

  navigateBackward() {
    const { section } = this.state;
    this.setState({ section: section - 1 });
  }

  render() {
    const { section } = this.state;
    const { instructionScreens } = this.props;
    const instructionText = instructionScreens[section];

    return (
      <div>
        {(section === 0) ? null : <button type="button" onClick={() => this.navigateBackward()}>Previous</button> }
        <div>
          {instructionText}
        </div>
        <button type="button" onClick={() => this.navigateForward()}>Next</button>
      </div>
    );
  }
}


Instructions.propTypes = {
  onFinish: PropTypes.func.isRequired,
  instructionScreens: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Instructions;

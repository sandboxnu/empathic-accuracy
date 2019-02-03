import React from 'react';
import { gridQuestionType } from '../types';
import grid from './affect.png';

class GridQuestion extends React.Component {

  render() {
    return ( <div> <img onClick={(e) => console.log(this.clickEvent(e))}
        className = "grid" src={grid} alt="Grid" /> </div>);
  }

  clickEvent(e) {
    // e = Mouse click event.
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    return x;
  }
}

GridQuestion.propTypes = gridQuestionType;


export default GridQuestion;

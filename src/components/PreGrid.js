import React, { Component } from "react";
import VideoQuestions from "./VideoQuestions";

class PreGrid extends Component {
  state = {
    clicked: false
  };

  render() {
    const { questions, player, handleClick } = this.props;

    return (
      <>
        {this.state.clicked ? (
          <VideoQuestions
            onSubmit={n => this.onSubmit(n)}
            questions={questions}
            // ! this is not working. Not sure what's happening here.
            // videoPos={player.then(res => {res.getCurrentTime()}}
          />
        ) : (
          <div className="questionPlaceholder" >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            iure sed doloribus! Odio perspiciatis quidem, nihil atque harum
            rerum officiis iste, maiores nostrum, facilis libero nobis.
            Inventore vel fugit eos animi perferendis earum, mollitia expedita
            voluptatem quas doloremque maxime iusto itaque dolores quo ipsam
            obcaecati nobis laborum odit maiores, soluta id tempore quam
            eligendi? Nesciunt ea eaque, fugit ducimus debitis illo commodi
            architecto ratione, voluptatibus sed ex eos rem possimus minima
            laudantium deserunt et cum obcaecati ullam eligendi tempora?
            Necessitatibus numquam nam hic ad totam reiciendis voluptas, soluta
            amet commodi. Temporibus optio debitis esse, placeat voluptas
            doloremque explicabo illo maiores!
            <button onClick={handleClick} type="submit">
              Begin
            </button>
          </div>
        )}
      </>
    );
  }
}

export default PreGrid;

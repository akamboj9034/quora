import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Answer extends Component {
  render() {
    return (
      <div className="searchresults">
        <Link to={`/question/${this.props.id}`} ><h5 className="quorafont">{this.props.question}</h5></Link>
        {this.props.answer}
      </div>
    )
  }
}

export default Answer

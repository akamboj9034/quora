import React, { Component } from 'react';
import Card from '@material-ui/core/Card';

export class TopicTile extends Component {

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    this.props.callback(this.props.id, e.target.checked)
  }

  render() {
    return (
      <div className="topictile">
        <Card>
        &nbsp;<input type="checkbox" onChange={this.handleChange}  />
        &nbsp;{this.props.name}<br/>
        <img src={this.props.image} alt="c" className="topictileimage"></img>
      </Card>
      </div>
    )
  }
}

export default TopicTile

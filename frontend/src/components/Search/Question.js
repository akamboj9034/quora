import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { rootUrl } from '../../config/settings';

export class Question extends Component {

  constructor(props) {
    super(props);
    this.state = {
      following: this.props.following
    }
    this.followQuestion = this.followQuestion.bind(this);
    this.unfollowQuestion = this.unfollowQuestion.bind(this);
  }

  followQuestion = (e) => {
    this.setState({ following: true })
    // post request to follow topic
    const data = {
      question_id: this.props.id,
      user_id: Cookies.get("_id")
    }
    axios.put(rootUrl + '/question/' + data.question_id + '/follow', data, {
      //headers: { "Authorization": `Bearer ${token}` }
    }).then((response) => {
      console.log("response data from toggleFollower ", response.data)
    });
  }

  unfollowQuestion = (e) => {
    this.setState({ following: false })
    // post request to unfollow topic
    const data = {
      question_id: this.props.id,
      user_id: Cookies.get("_id")
    }
    axios.put(rootUrl + '/question/' + data.question_id + '/unfollow', data, {
      //headers: { "Authorization": `Bearer ${token}` }
    }).then((response) => {
      console.log("response data from toggleFollower ", response.data)
    });
  }

  render() {
    return (
      <div className="searchresults">
        <Link to={`/question/${this.props.id}`} ><h5><span className="quorafont" >{this.props.question}</span></h5></Link>
        {(this.state.following)
          ? <span className="modalcloseicon light" onClick={this.unfollowQuestion} ><i className="fas fa-check-circle"></i> Following</span>
          : <span className="modalcloseicon dark" onClick={this.followQuestion}><i className="fas fa-plus-circle"></i> Follow</span>}
      </div>
    )
  }
}

export default Question

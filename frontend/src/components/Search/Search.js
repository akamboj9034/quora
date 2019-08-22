import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import queryString from 'query-string';
import Topic from './Topic';
import Question from './Question';
import Answer from './Answer';
import Profile from './Profile'
import axios from 'axios';
import { rootUrl } from '../../config/settings';

export class Search extends Component {

  constructor(props) {
    super(props);
    const values = queryString.parse(this.props.location.search);
    this.state = {
      q: values.q,
      type: "question",
      questions: [],
      answers: [],
      topics: [],
      profiles: []
    }
    this.filterbyQuestion = this.filterbyQuestion.bind(this);
    this.filterbyAnswer = this.filterbyAnswer.bind(this);
    this.filterbyTopic = this.filterbyTopic.bind(this);
    this.filterbyProfile = this.filterbyProfile.bind(this);
  }

  filterbyQuestion() {
    this.setState({ type: "question" })
  }

  filterbyAnswer() {
    this.setState({ type: "answer" })
  }

  filterbyProfile() {
    this.setState({ type: "profile" })
  }

  filterbyTopic() {
    this.setState({ type: "topic" })
  }

  componentDidMount() {
    // console.log("In c d mount: ", this.state.q, this.state.type)
    axios.get(rootUrl + "/search?q=" + this.state.q)
      .then((result) => {
        console.log(result.data)
        this.setState({
          questions: result.data.data.question,
          answers: result.data.data.answer,
          topics: result.data.data.topic,
          profiles: result.data.data.user
        })
      })
  }

  render() {
    return (
      <div>
        <Container className="searchContainer">
          <Row>
            <Col sm={2}>
              <ul className="searchByTypeList">
                <li>By Type</li><hr />
                <li className="searchtype" onClick={this.filterbyQuestion}>Question</li>
                <li className="searchtype" onClick={this.filterbyAnswer}>Answer</li>
                <li className="searchtype" onClick={this.filterbyProfile}>Profile</li>
                <li className="searchtype" onClick={this.filterbyTopic}>Topic</li>
              </ul>
            </Col>
            <Col sm={8}>
              {(this.state.type === "question")
                ? (this.state.questions).map((r, index) => {
                  return <Question id={r._id} question={r.question} folowing={false} key={index} />
                })
                : (this.state.type === "answer")
                  ? (this.state.answers).map((r, index) => {
                    return <Answer id={r._id} question={r.question.question} answer={r.answer} key={index} />
                  })
                  : (this.state.type === "profile")
                    ? (this.state.profiles).map((r, index) => {
                      return <Profile id={r._id} name={r.firstname + " " + r.lastname} image={r.image} following={false} credential={r.credential} key={index} />
                    })
                    : (this.state.type === "topic")
                      ? (this.state.topics).map((r, index) => {
                        return <Topic id={r._id} topicname={r.name} following={false} topicimage={r.image} key={index} />
                      })
                      : (this.state.questions).map((r, index) => {
                        return <Question id={r._id} question={r.question} folowing={false} key={index} />
                      })
                // show all components
              }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Search

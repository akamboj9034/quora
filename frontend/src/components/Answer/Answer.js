import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import QuestionComponent from './QuestionComponent';

export class Answer extends Component {

    constructor(props){
        super(props);
        this.state = {
            questions: []
        }
    }

    componentDidMount(){
        let questions = [
            {id:"id1", question:"Is this a question ?"},
            {id:"id2", question:"This is a question ?"},
            {id:"id3", question:"Whats my name ?"},
            {id:"id4", question:"Is this a question ?"}
        ]
        this.setState({ questions });
    }

  render() {
    return (
      <div className="top_100">
          <Container >
              <Row>
                  <Col sm={2}></Col>
                  <Col sm={8}>                    
                    {(this.state.questions).map((q, index) => {
                        return <QuestionComponent id={q.id} question={q.question} following={false} key={index} />
                    })}
                  </Col>
              </Row>
          </Container>
      </div>
    )
  }
}

export default Answer

import React, { Component } from 'react';
import { Row, Col, Media, Container } from 'react-bootstrap';
import { rootUrl, frontendUrl } from '../../config/settings';
import axios from 'axios';
import AnswerComponent from '../Question/AnswerComponent'

class Question extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            question: '',
            questionOwner: '',
            follower: 0,
            answer: '',
            answer_owner: '',
            date: '',
            view: 0,
            questionData: []
        }
    }

    componentDidMount() {
        //var token = localStorage.getItem("token");
        let questionid = this.props.match.params.questionid;
        axios.get(rootUrl + '/question/' + questionid, {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from questions ", response.data.data);
                this.setState({ questionData: response.data.data })
            });
    }


    render() {

        let answers = this.state.questionData.answer
        let question = this.state.questionData
        console.log("questionData on state", question.answer)
        let answerLength = 0
        let details = ''

        if (answers && answers.length > 0) {
            details = answers.map((answer, index) => {
                answerLength = answers.length
                return <Row>
                    <Col sm={2}></Col>
                    <Col sm={8}>
                        <AnswerComponent answer={answer} /><br />
                    </Col>
                    <Col sm={2}></Col>
                </Row>
            })
        }

        return (
            <div>
                <Container id="profileContainer">
                    <Row >
                        <Col sm={2}></Col>
                        <Col sm={8}>
                            <Row>
                                <Media>
                                    <Media.Body>
                                        <h4 className="heading4">{question.question}</h4>
                                        <Row id="media-row">
                                            <Row> <h5>No answer yet</h5> <h5>Asked {question.date}</h5></Row>
                                        </Row>
                                        <Row>
                                            <Col sm={3}><i className="far fa-edit fa-1x navlinkText"></i>&nbsp;&nbsp;<span>Answer</span>&nbsp;</Col>
                                            <Col sm={3}><i className="fas fa-rss fa-1x navlinkText"></i>&nbsp;&nbsp;<span>Follow .</span>&nbsp;{!(question.follower) ? 0 : question.follower.length}</Col>
                                            <Col sm={4}><i className="far fa-user fa-1x navlinkText"></i>&nbsp;&nbsp;<span> Answer Anonymous</span>&nbsp;</Col>

                                        </Row>
                                    </Media.Body>
                                </Media>
                            </Row>
                            <br />
                            <Row id="headingRow">
                                <Col ><h3 className="heading3">{answerLength} Answers</h3></Col>
                            </Row>
                        </Col>
                        <Col sm={2}></Col>
                    </ Row >
                    {details}
                </Container>
            </div >

        )

    }

}

export default Question
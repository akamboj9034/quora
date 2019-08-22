import React, { Component } from 'react';
import { Row, Col, Media, Button, Collapse, Image } from 'react-bootstrap';
import { rootUrl, frontendUrl } from '../../config/settings';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import { randomNumber } from '../Utilities/RandomNumberGenerator'

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'image'
]

class Questions extends Component {
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
            questionData: '',
            text: '',
            answerIdOpen: []
        }

        this.toggleAnswerView = this.toggleAnswerView.bind(this)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.updateAnswer = this.updateAnswer.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.toggleFollower = this.toggleFollower.bind(this)
    }

    componentDidMount() {
        //var token = localStorage.getItem("token");
        let userid = this.props.userid;
        axios.get(rootUrl + '/user/' + userid + '/questions', {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from questions ", response.data.data);
                let responseData = response.data.data
                if (responseData && responseData.question.length > 0) {
                    for (let i = 0; i < responseData.question.length; i++) {
                        this.state.answerIdOpen.push(false)
                    }
                }
                this.setState({ questionData: response.data.data })
            });
    }

    toggleAnswerView = (e) => {
        let index = e.target.id
        this.state.answerIdOpen[index] = true
        this.setState({
            answerIdOpen: this.state.answerIdOpen
        })
    }

    handleEditorChange(value) {
        this.setState({
            text: value,
            answer: value
        })

    }


    updateAnswer = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        let index = e.target.id
        let userid = this.props.userid;
        let questionId = this.state.questionData.question[index]._id
        const data = {
            answer: this.state.answer,
            answer_owner: userid,
            question_id: questionId
        }
        console.log("data in updateAnswer", data)
        axios.post(rootUrl + '/answer/', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from upateAnswer ", response.data)
            this.state.answerIdOpen[index] = false
            this.state.questionData.question[index].answer.push(this.state.answer)
            this.setState({
                text: '',
                answer: '',
                answerIdOpen: this.state.answerIdOpen
            })
        });
    }

    handleClose = (e) => {
        let index = e.target.id
        this.state.answerIdOpen[index] = false
        this.setState({
            text: '',
            answer: ''
        })
    }

    toggleFollower = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        let index = e.target.id
        let userid = this.props.userid
        let questionId = this.state.questionData.question[index]._id
        const data = {
            user_id: userid
        }
        this.state.questionData.question[index].follower.push(questionId)
        console.log("data in toggleFollowr", data)
        axios.put(rootUrl + '/question/' + questionId + '/follow', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleFollower ", response.data)
            this.setState({
                questionData : this.state.questionData
            })
        });
    }

    render() {
        let metadata = this.props.metadata
        console.log("metadata in questions", metadata)
        let questions = this.state.questionData.question
        if (this.state.questionData === '' || questions.length === 0) {
            return (
                <div>
                    <Row>
                        <Col ><h3 className="heading3">Questions</h3></Col>
                    </Row>
                    <Row>
                        <Col>No questions yet.</Col>
                    </Row>
                </div>
            )
        }
        else {
            let details = questions.map((question, index) => {
                let questionPath = frontendUrl + '/question/' + question._id
                return (
                    <div >
                        <Media>
                            <Media.Body>
                                <a href={questionPath} target="_blank" className="onLink"><h4 className="heading4">{question.question}</h4></a>

                                <Row id="media-row">
                                    <Row> {question.answer && question.answer.length > 0
                                        ? <h5>{question.answer.length} Answers</h5>
                                        : <h5>No answer yet</h5>} <h5>Asked {question.date}</h5>
                                    </Row>
                                </Row>
                                <Row>
                                    <Col sm={3}><Button className="ques-answer" variant="light" id={index} onClick={this.toggleAnswerView}><i id={index} className="far fa-edit fa-1x navlinkText"></i>&nbsp;&nbsp;<span id={index}>Answer</span></Button>&nbsp;</Col>
                                    <Col sm={3}><Button className="ques-follow" variant="light" id={index} onClick={this.toggleFollower}><i id={index} className="fas fa-rss fa-1x navlinkText"></i>&nbsp;&nbsp;<span id={index}>Follow .</span>&nbsp;{!(question.follower) ? 0 : question.follower.length}</Button></Col>
                                    <Col sm={4}>
                                        <Button className="ques-follow" variant="light" id={index}>
                                            <Link to={{
                                                pathname: `/anonymous/${randomNumber()}`,
                                                state: {
                                                    question: question.question,
                                                    question_id: question._id
                                                }
                                            }}>
                                                <i className="far fa-user fa-1x navlinkText"></i>&nbsp;&nbsp;<span> Anonymous</span></Link>
                                            &nbsp;
                                        </Button>
                                    </Col>

                                </Row>
                                <Row >
                                    <Collapse in={this.state.answerIdOpen[index]} className="quill-wrapper-row">
                                        <div className="quill-div">
                                            <Row className="quill-cred-row">
                                                <Col sm={1} className="quill-col-1">
                                                    <Image src={rootUrl + metadata.image} className="img-rounded img-responsive"
                                                        alt="not available" height="50" width="50" roundedCircle />
                                                </Col>
                                                <Col sm={10} className="quill-col-10">
                                                    <Row className="quill-col-10-row1"><h6>{metadata.owner}</h6></Row>
                                                    <Row className="quill-col-10-row2"><small>{metadata.profileCred}</small></Row>
                                                </Col>
                                            </Row>
                                            <ReactQuill
                                                className="quill-answer-editor"
                                                onChange={this.handleEditorChange}
                                                value={this.state.answer}
                                                modules={modules}
                                                formats={formats}
                                            />
                                            <Button id={index} type="submit" variant="info" size="sm" onClick={this.updateAnswer}>Submit</Button>&nbsp;
                                            <Button id={index} type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button>
                                        </div>
                                    </Collapse>
                                </Row>
                            </Media.Body>
                        </Media>
                    </div >

                )
            });


            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">{questions.length} Questions</h3></Col>
                    </Row>
                    <Row>
                        {details}
                    </Row>
                </div >

            )

        }
    }
}

export default Questions
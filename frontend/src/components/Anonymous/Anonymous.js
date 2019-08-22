import React, { Component } from 'react';
import { Row, Col, Media, Button, Collapse, Image, Container } from 'react-bootstrap';
import { rootUrl, frontendUrl } from '../../config/settings';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

class Anonymous extends Component {
    constructor(props) {
        super(props)
        this.state = {
            answer: '',
            text: '',
            answerPosted: false
        }

        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.updateAnswer = this.updateAnswer.bind(this)
        this.handleClose = this.handleClose.bind(this)
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
        let questionId = this.props.location.state.question_id
        const data = {
            answer_name: this.state.answer,
            question: questionId,
            answer_link: frontendUrl + "/anonymous/" + this.props.match.params.anonymousid
        }
        console.log("data in updateAnswer", data)
        this.setState({
            answerPosted: true
        })
        axios.post(rootUrl + '/answer/anonymous/', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from upateAnswer ", response.data)
            this.setState({
                text: '',
                answerPosted: true
            })
        });
    }

    handleClose = () => {
        this.setState({
            text: '',
            answer: ''
        })
    }


    render() {
        let anonymous_id = this.props.match.params.anonymousid
        let question = ''
        let question_id = ''
        let imageUrl = "/public/uploads/profilephoto/blank.jpeg"

        if (this.props.location.state) {
            question = this.props.location.state.question
            question_id = this.props.location.state.question_id
        }
        let details = ''
        if (this.state.answerPosted) {
            details = <Media>
                <Media.Body>
                    <Row id="media-row">
                        <Col sm={1}>
                            <Image src={rootUrl + imageUrl} className="img-rounded img-responsive"
                                alt="not available" height="70" width="70" roundedCircle />
                        </Col>
                        <Col id="smallCol"></Col>
                        <Col sm={9}>
                            <Row><h4 className="heading4">Anonymous</h4></Row>
                            <Row><h5>Answered just now</h5></Row>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>
                    <br />
                    <p id="para"><div dangerouslySetInnerHTML={{ __html: this.state.answer }} /></p>
                    <Row id="button-row">
                        <Col sm={4}><Button size="sm" onClick={this.increaseVote}><i className="fas fa-arrow-up fa-1x navlinkText"></i>&nbsp;&nbsp;<span >Upvote</span></Button></Col>
                        <Col sm={4}><Button size="sm" onClick={this.decreaseVote}><i className="fas fa-arrow-down fa-1x navlinkText"></i>&nbsp;&nbsp;<span >Downvote</span></Button></Col>
                    </Row>
                </Media.Body>
            </Media>
        }
        else {
            details = <Media>
                <Media.Body>
                    <Row className="quill-wrapper-row">

                        <div className="quill-div">
                            <Row className="quill-cred-row">
                                <Col sm={1} className="quill-col-1">
                                    <Image src={rootUrl + imageUrl} className="img-rounded img-responsive"
                                        alt="not available" height="50" width="50" roundedCircle />
                                </Col>
                                <Col sm={10} className="quill-col-10">
                                    <Row className="quill-col-10-row1"><h6>Anonymous</h6></Row>
                                    <Row className="quill-col-10-row2"><small></small></Row>
                                </Col>
                            </Row>
                            <ReactQuill
                                className="quill-answer-editor"
                                onChange={this.handleEditorChange}
                                value={this.state.answer}
                                modules={modules}
                                formats={formats}
                            />
                            <Button type="submit" variant="info" size="sm" onClick={this.updateAnswer}>Submit</Button>&nbsp;
                    <Button type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button>
                        </div>

                    </Row>
                </Media.Body>
            </Media>
        }

        return (
            <div>
                <Container id="profileContainer">
                    <Row id="anonyRow">
                        <Col sm={2}></Col>
                        <Col sm={8}><h4 className="heading4"> {question}</h4></Col>
                        <Col sm={2}></Col>
                    </Row>
                    <Row>
                        <Col sm={2}></Col>
                        <Col sm={8}>
                            <div >
                                {details}
                            </div >
                        </Col>
                        <Col sm={2}></Col>
                    </Row>
                </Container>
            </div >

        )

    }

}

export default Anonymous
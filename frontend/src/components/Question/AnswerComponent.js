import React, { Component } from 'react';
import { Row, Col, Media, Image, Button } from 'react-bootstrap';
import { rootUrl, frontendUrl } from '../../config/settings';
import axios from 'axios';

class Answers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            question: '',
            answer: '',
            answer_owner: '',
            image: '',
            anonymous: '',
            upvote: 0,
            downvote: 0,
            comment: [
            ],
            date: '',
            view: 0,
            answerData: '',
            answers: [],
            downvotedAnswerId: [],
            upvotedAnswerId: []
        }

        this.increaseVote = this.increaseVote.bind(this);
        this.decreaseVote = this.decreaseVote.bind(this);
    }


    increaseVote = (e) => {
        //var token = localStorage.getItem("token");
        // let index = e.target.id;
        // let answer_id = this.state.answerData.answer[index]._id
        // if (!this.state.answerData.answer[index].upvote) {
        //     this.state.answerData.answer[index].upvote = 1
        //     this.state.answerData.answer[index].downvote = this.state.answerData.answer[index].downvote - 1;
        // }
        // else {
        //     this.state.answerData.answer[index].upvote = this.state.answerData.answer[index].upvote + 1;
        //     this.state.answerData.answer[index].downvote = this.state.answerData.answer[index].downvote - 1;
        // }
        // const data = {
        //     user_id: this.props.userid
        // }
        // this.state.upvotedAnswerId.push(answer_id)
        // this.state.downvotedAnswerId.splice(this.state.downvotedAnswerId.indexOf(answer_id), 1);
        // axios.put(rootUrl + '/answer/' + answer_id + '/upvote', data, {
        //     //headers: { "Authorization": `Bearer ${token}` }
        // }).then((response) => {
        //     console.log("response data from upvote ", response.data);
        //     this.setState({
        //         answerData: this.state.answerData
        //     })
        // });
    }

    decreaseVote = (e) => {
        //var token = localStorage.getItem("token");
        // let index = e.target.id;
        // let answer_id = this.state.answerData.answer[index]._id
        // if (!this.state.answerData.answer[index].downvote) {
        //     this.state.answerData.answer[index].downvote = 1
        //     this.state.answerData.answer[index].upvote = this.state.answerData.answer[index].upvote - 1;
        // }
        // else {
        //     this.state.answerData.answer[index].downvote = this.state.answerData.answer[index].downvote + 1;
        //     this.state.answerData.answer[index].upvote = this.state.answerData.answer[index].upvote - 1;
        // }
        // const data = {
        //     user_id: this.props.userid
        // }
        // this.state.downvotedAnswerId.push(answer_id)
        // this.state.upvotedAnswerId.splice(this.state.upvotedAnswerId.indexOf(answer_id), 1);
        // axios.put(rootUrl + '/answer/' + answer_id + '/downvote', data, {
        //     //headers: { "Authorization": `Bearer ${token}` }
        // }).then((response) => {
        //     console.log("response data from downvote ", response.data);
        //     this.setState({
        //         answerData: this.state.answerData
        //     })
        // });
    }

    render() {
        let answer = this.props.answer
        let disableDownvote = false
        let disableUpvote = false
        let index = answer._id
        // if (metadata.downvote !== 0 && metadata.downvote.length >= 0) {
        //     if (metadata.downvote.includes(answer._id)) {
        //         disableDownvote = true
        //     }
        // }
        // if (metadata.upvote !== 0 && metadata.upvote.length >= 0) {
        //     if (metadata.upvote.includes(answer._id)) {
        //         disableUpvote = true
        //     }
        // }
        // if (this.state.upvotedAnswerId.includes(answer._id)) {
        //     disableUpvote = true
        //     disableDownvote = false
        // }
        // if (this.state.downvotedAnswerId.includes(answer._id)) {
        //     disableDownvote = true
        //     disableUpvote = false
        // }

        return (
            <div>
                {/* <Row id="headingRow">
                    <Col ><h3 className="heading3">{answer.length} Answers</h3></Col>
                </Row> */}
                <Row >
                    <div >
                        <Media>
                            <Media.Body>
                                <Row id="media-row">
                                    <Col sm={1}>
                                        <Image src={rootUrl + answer.answer_owner.image} className="img-rounded img-responsive"
                                            alt="not available" height="70" width="70" roundedCircle />
                                    </Col>
                                    <Col xs={1}></Col>
                                    <Col sm={9}>
                                        <Row><h4 className="heading4">{answer.answer_owner.firstname} {answer.answer_owner.lastname}</h4></Row>
                                        <Row><h5>Answered {answer.date}</h5></Row>
                                    </Col>
                                    <Col xs={1}></Col>
                                </Row>
                                <br />
                                <p id="para"><div dangerouslySetInnerHTML={{ __html: answer.answer }} /></p>
                                <Row id="button-row">
                                    <Col sm={4}><Button disabled={disableUpvote} size="sm" id={index} onClick={this.increaseVote}><i className="fas fa-arrow-up fa-1x navlinkText"></i>&nbsp;&nbsp;<span id={index}>Upvote</span>&nbsp;{(!answer.upvote) ? 0 : answer.upvote}</Button></Col>
                                    <Col sm={4}><Button disabled={disableDownvote} size="sm" id={index} onClick={this.decreaseVote}><i className="fas fa-arrow-down fa-1x navlinkText"></i>&nbsp;&nbsp;<span id={index}>Downvote</span>&nbsp;{(!answer.downvote) ? 0 : answer.downvote}</Button></Col>
                                </Row>
                            </Media.Body>
                        </Media>

                    </div >
                </Row>
            </div>
        )


    }
}

export default Answers
import React, { Component } from 'react';
import { Row, Col, Media, Image, Button } from 'react-bootstrap';
import { rootUrl, frontendUrl } from '../../config/settings';
import axios from 'axios';
import ReactPaginate from 'react-paginate'

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
            upvotedAnswerId: [],
            filteredAnswers: [],
            pageCount: 0,
            bookmark: []
        }

        this.increaseVote = this.increaseVote.bind(this);
        this.decreaseVote = this.decreaseVote.bind(this);
        this.toggleBookmark = this.toggleBookmark.bind(this)
    }

    componentDidMount() {
        //var token = localStorage.getItem("token");
        let userid = this.props.userid;
        axios.get(rootUrl + '/user/' + userid + '/answers', {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from answers ", response.data.data);
                this.setState({
                    answerData: response.data.data,
                    filteredAnswers: response.data.data.answer.slice(0, 2),
                    pageCount: response.data.data.answer.length / 2
                })
            });
    }


    increaseVote = (e) => {
        //var token = localStorage.getItem("token");
        let index = e.target.id;
        let answer_id = this.state.answerData.answer[index]._id
        if (!this.state.answerData.answer[index].upvote) {
            this.state.answerData.answer[index].upvote = 1
            this.state.answerData.answer[index].downvote = this.state.answerData.answer[index].downvote - 1;
        }
        else {
            this.state.answerData.answer[index].upvote = this.state.answerData.answer[index].upvote + 1;
            this.state.answerData.answer[index].downvote = this.state.answerData.answer[index].downvote - 1;
        }
        const data = {
            user_id: this.props.userid
        }
        this.state.upvotedAnswerId.push(answer_id)
        this.state.downvotedAnswerId.splice(this.state.downvotedAnswerId.indexOf(answer_id), 1);
        axios.put(rootUrl + '/answer/' + answer_id + '/upvote', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from upvote ", response.data);
            this.setState({
                answerData: this.state.answerData
            })
        });
    }

    decreaseVote = (e) => {
        //var token = localStorage.getItem("token");
        let index = e.target.id;
        let answer_id = this.state.answerData.answer[index]._id
        if (!this.state.answerData.answer[index].downvote) {
            this.state.answerData.answer[index].downvote = 1
            this.state.answerData.answer[index].upvote = this.state.answerData.answer[index].upvote - 1;
        }
        else {
            this.state.answerData.answer[index].downvote = this.state.answerData.answer[index].downvote + 1;
            this.state.answerData.answer[index].upvote = this.state.answerData.answer[index].upvote - 1;
        }
        const data = {
            user_id: this.props.userid
        }
        this.state.downvotedAnswerId.push(answer_id)
        this.state.upvotedAnswerId.splice(this.state.upvotedAnswerId.indexOf(answer_id), 1);
        axios.put(rootUrl + '/answer/' + answer_id + '/downvote', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from downvote ", response.data);
            this.setState({
                answerData: this.state.answerData
            })
        });
    }

    handlePageClick = (e) => {
        var temp = this.state.answerData.answer.slice(e.selected * 2, (e.selected * 2) + 2)
        console.log(temp)
        this.setState({
            filteredAnswers: temp
        })
    }

    toggleBookmark = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        let index = e.target.id
        const data = {
            user_id: this.props.userid
        }
        let answer_id = this.state.answerData.answer[index]._id
        axios.put(rootUrl + '/answer/' + answer_id + '/bookmark', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleBookmark ", response.data);
            this.setState({
                bookmark: response.data.data.bookmark
            })
        });
    }

    render() {
        console.log("answers in render", this.state.answerData.answer)
        let answers = this.state.answerData.answer
        let metadata = this.props.metadata
        console.log("downvotedAnswerid", this.state.downvotedAnswerId, this.state.upvotedAnswerId)
        if (this.state.answerData === '' || answers.length === 0) {
            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">Answers</h3></Col>
                    </Row>
                    <Row>
                        <Col >You haven't answered any questions yet.</Col>
                    </Row>
                </div>
            )
        }
        else {
            let details =
                this.state.filteredAnswers.map((answer, index) => {
                    let disableDownvote = false
                    let disableUpvote = false
                    let answerPath = frontendUrl + '/answer/' + answer._id
                    let bookmarked = "Bookmark"
                    if (metadata.downvote !== 0 && metadata.downvote.length >= 0) {
                        if (metadata.downvote.includes(answer._id)) {
                            disableDownvote = true
                        }
                    }
                    if (metadata.upvote !== 0 && metadata.upvote.length >= 0) {
                        if (metadata.upvote.includes(answer._id)) {
                            disableUpvote = true
                        }
                    }
                    if (this.state.upvotedAnswerId.includes(answer._id)) {
                        disableUpvote = true
                        disableDownvote = false
                    }
                    if (this.state.downvotedAnswerId.includes(answer._id)) {
                        disableDownvote = true
                        disableUpvote = false
                    }
                    if (metadata.bookmark && metadata.bookmark.length > 0) {
                        bookmarked = metadata.bookmark.includes(answer._id) ? "Bookmarked" : "Bookmark"
                    }
                    if (this.state.bookmark && this.state.bookmark.length > 0) {
                        bookmarked = this.state.bookmark.includes(answer._id) ? "Bookmarked" : "Bookmark"
                    }
                    return (
                        <div >
                            <Media>
                                <Media.Body>
                                    <a href={answerPath} target="_blank" className="onLink"><h4 className="heading4">{answer.question.question}</h4></a>
                                    <Row id="media-row">
                                        <Col sm={1}>
                                            <Image src={rootUrl + metadata.image} className="img-rounded img-responsive"
                                                alt="not available" height="70" width="70" roundedCircle />
                                        </Col>
                                        <Col id="smallCol"></Col>
                                        <Col sm={9}>
                                            <Row><h4 className="heading4">{metadata.owner}</h4></Row>
                                            <Row><h5>Answered {answer.date}</h5></Row>
                                        </Col>
                                        <Col xs={1}></Col>
                                    </Row>
                                    <br />
                                    <span><div id="para" dangerouslySetInnerHTML={{ __html: answer.answer }} /></span> &nbsp;
                                    {/* <p id="para">{answer.answer}</p> */}
                                    {/* <span id="view-span"><h5>{answer.view} views</h5></span> */}
                                    <Row id="button-row">
                                        <Col sm={4}><Button disabled={disableUpvote} size="sm" id={index} onClick={this.increaseVote}><i className="fas fa-arrow-up fa-1x navlinkText"></i>&nbsp;&nbsp;<span id={index}>Upvote</span>&nbsp;{(!answer.upvote) ? 0 : answer.upvote}</Button></Col>
                                        <Col sm={4}><Button disabled={disableDownvote} size="sm" id={index} onClick={this.decreaseVote}><i className="fas fa-arrow-down fa-1x navlinkText"></i>&nbsp;&nbsp;<span id={index}>Downvote</span>&nbsp;{(!answer.downvote) ? 0 : answer.downvote}</Button></Col>
                                        <Col sm={4}>
                                            <Button size="sm" id={index} onClick={this.toggleBookmark}>
                                                {bookmarked === "Bookmark" ? <i id={index} className="far fa-bookmark fa-1x navlinkText"></i> : <i id={index} className="fas fa-bookmark fa-1x navlinkText"></i>}
                                                &nbsp;&nbsp;<span id={index}>{bookmarked}</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Media.Body>
                            </Media>

                        </div >

                    )
                });

            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">{answers.length} Answers</h3></Col>
                    </Row>
                    <Row >
                        {details}
                    </Row>
                    <Row>
                        <ReactPaginate previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={<a href="">...</a>}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                    </Row>
                </div>
            )
        }

    }
}

export default Answers
import React, { Component } from 'react';
import { rootUrl } from '../../config/settings';
import { Row, Col, Navbar as Bar, Image, Button, Media, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import AnswerComponent from '../Question/AnswerComponent'

class Activity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activity: []
        }
    }
    componentDidMount() {
        var token = localStorage.getItem("token")
        let userid = this.props.userid
        axios.get(rootUrl + '/user/' + userid + '/activity', {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from activity", response.data);
                this.setState({ activity: response.data.data })
            });
    }

    render() {

        let metadata = this.props.metadata
        if (this.state.activity.length === 0) {
            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">Activity</h3></Col>
                    </Row>
                    <Row>
                        <Col >You don't have any activity yet.</Col>
                    </Row>
                </div>
            )
        }
        else {
            let details = this.state.activity.map((activity, index) => {
                let content = ''
                let component = 'Answer'
                let subcontent = ''
                if (activity.activity_name === 'Followed a question') {
                    content = activity.activity.question
                    component = 'Question'
                    subcontent = ''
                }
                if (activity.activity_name === 'Followed a topic') {
                    content = activity.activity.name
                    component = 'Topic'
                }
                if (activity.activity_name === 'Followed a user') {
                    content = activity.activity.firstname + " " + activity.activity.lastname
                    component = 'User'
                }
                if (activity.activity_name === 'Posted an answer' || activity.activity_name === 'Upvoted an answer'
                    || activity.activity_name === 'Downvoted an answer' || activity.activity_name === 'Bookmarked an answer'
                    || activity.activity_name === 'Commented on an answer') {
                    content = activity.activity.question.question
                    component = 'Answer'
                    //subcontent = <AnswerComponent answer={activity.activity} />
                }
                return (
                    <div >
                        <Media>
                            <Media.Body>
                                <Row>
                                    <Col sm={1} id="activity-col-1">
                                        <Image src={rootUrl + metadata.image} className="img-rounded img-responsive"
                                            alt="not available" height="30" width="30" roundedCircle />
                                    </Col>
                                    <Col sm={10}>
                                        <h5 id="heading5">{metadata.owner} {activity.activity_name} on {activity.date}</h5>
                                    </Col>


                                </Row>
                                <Row className="activity-content"><h4 className="heading4">{content}</h4></Row>
                                <Row id="media-row">
                                    {/* <Col sm={1}>
                                        <Image src={rootUrl + metadata.image} className="img-rounded img-responsive"
                                            alt="not available" height="70" width="70" roundedCircle />
                                    </Col> */}
                                    <Col xs={1}></Col>
                                    <Col sm={9}>{subcontent}
                                    </Col>
                                    <Col xs={1}></Col>
                                </Row>
                                <br />
                            </Media.Body>
                        </Media>

                    </div >

                )
            });

            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">{this.state.activity.length} Activity</h3></Col>
                    </Row>
                    <Row >
                        {details}
                    </Row>
                </div>
            )
        }

    }
}

export default Activity
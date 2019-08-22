import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import queryString from 'query-string';
import Topic from '../Search/Topic';
import Question from '../Search/Question';
import Answer from '../Search/Answer';
import Profile from '../Search/Profile'
import axios from 'axios';
import { rootUrl } from '../../config/settings';

export class Content extends Component {

    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            q: values.q,
            type: 'all',
            questions: [],
            answers: [],
            topics: [],
            profiles: [],
            activity: []
        }
        this.filterbyQuestion = this.filterbyQuestion.bind(this);
        this.filterbyAnswer = this.filterbyAnswer.bind(this);
        this.filterbyTopic = this.filterbyTopic.bind(this);
        this.filterbyProfile = this.filterbyProfile.bind(this);
        this.filterbyAllTypes = this.filterbyAllTypes.bind(this);
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

    filterbyAllTypes() {
        this.setState({ type: "all" })
    }

    componentDidMount() {

        //var token = localStorage.getItem("token")
        let userid = localStorage.getItem("userid")
        axios.get(rootUrl + '/user/' + userid + '/activity', {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from activity", response.data);
                let activities = response.data.data
                let questions = []
                let answers = []
                let topics = []
                let profiles = []
                activities.map((activity, index) => {
                    let content = ''
                    let component = 'Answer'
                    let subcontent = ''
                    if (activity.activity_name === 'Followed a question') {
                        content = activity.activity.question
                        questions.push(activity.activity)
                        component = 'Question'
                        subcontent = ''
                    }
                    if (activity.activity_name === 'Followed a topic') {
                        topics.push(activity.activity)
                        content = activity.activity.name
                        component = 'Topic'
                    }
                    if (activity.activity_name === 'Followed a user') {
                        profiles.push(activity.activity)
                        content = activity.activity.firstname + " " + activity.activity.lastname
                        component = 'User'
                    }
                    if (activity.activity_name === 'Posted an answer' || activity.activity_name === 'Upvoted an answer'
                        || activity.activity_name === 'Downvoted an answer' || activity.activity_name === 'Bookmarked an answer'
                        || activity.activity_name === 'Commented on an answer') {
                        answers.push(activity.activity)
                        content = activity.activity.question.question
                        component = 'Answer'
                        //subcontent = <AnswerComponent answer={activity.activity} />
                    }
                    this.setState({
                        activity: activities,
                        questions: questions,
                        answers: answers,
                        topics: topics,
                        profiles: profiles
                    })
                });
            });
    }

    render() {
        let detailsQues = (this.state.questions).map((r, index) => {
            return <Question id={r._id} question={r.question} folowing={false} key={index} />
        })
        let detailsAns = (this.state.answers).map((r, index) => {
            return <Answer id={r._id} question={r.question.question} answer={r.answer} key={index} />
        })
        let detailsProf = (this.state.profiles).map((r, index) => {
            return <Profile id={r._id} name={r.firstname + " " + r.lastname} image={r.image} following={false} credential={r.credential} key={index} />
        })
        let detailsTopics = (this.state.topics).map((r, index) => {
            return <Topic id={r._id} topicname={r.name} following={false} topicimage={r.image} key={index} />
        })
        console.log("detailsQues", detailsQues)
        console.log("detailsAns", detailsAns)
        console.log("detailsProf", detailsProf)
        console.log("detailsTopics", detailsTopics)
        let details = []
        let showAll = false
        switch (this.state.type) {
            case 'question':
                details = detailsQues
                break;
            case 'answer':
                details = detailsAns
                break;
            case 'profile':
                details = detailsProf
                break;
            case 'topic':
                details = detailsTopics
                break;
            default:
                showAll = true
                break;
        }
        console.log("details", details)
        return (

            <div>
                <Container className="searchContainer">
                    <Row>
                        <Col sm={2}>
                            <ul className="searchByTypeList">
                                <li>By Type</li><hr />
                                <li className="searchtype" onClick={this.filterbyAllTypes}>All Types</li>
                                <li className="searchtype" onClick={this.filterbyQuestion}>Question</li>
                                <li className="searchtype" onClick={this.filterbyAnswer}>Answer</li>
                                <li className="searchtype" onClick={this.filterbyProfile}>Profile</li>
                                <li className="searchtype" onClick={this.filterbyTopic}>Topic</li>
                            </ul>
                        </Col>
                        {showAll ?
                            <Col sm={8}>
                                {detailsQues}
                                {detailsAns}
                                {detailsProf}
                                {detailsTopics}
                            </Col>
                            :
                            <Col sm={8}>
                                {details}
                            </Col>
                        }
                    </Row>
                </Container>
            </div >
        )
    }
}

export default Content

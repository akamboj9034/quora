import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { rootUrl } from '../../config/settings';

export class Topic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            following: this.props.following
        }
        this.followTopic = this.followTopic.bind(this);
        this.unfollowTopic = this.unfollowTopic.bind(this);
    }

    followTopic = (e) => {
        this.setState({ following: true })
        // post request to follow topic
        const data = {
            id: this.props.id,
            user_id: Cookies.get("_id")
        }
        axios.put(rootUrl + "/user/" + Cookies.get("_id") + "/topic/" + data.id + "/follow", data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleFollower ", response.data)
        });
    }

    unfollowTopic = (e) => {
        this.setState({ following: false })
        // post request to unfollow topic
        const data = {
            id: this.props.id,
            user_id: Cookies.get("_id")
        }
        axios.put(rootUrl + "/user/" + Cookies.get("_id") + "/topic/" + data.id + "/unfollow", data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleFollower ", response.data)
        });
    }

    render() {
        return (
            <div className="searchresults">
                <img src={this.props.topicimage} alt="topic image" height="30px" width="30px" />&nbsp;Topic: &nbsp;
        <Link to={`/topic/${this.props.id}`} className="topicLink" >{this.props.topicname}</Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {(this.state.following)
                    ? <span className="modalcloseicon light" onClick={this.unfollowTopic}><i className="fas fa-check-circle"></i> Following</span>
                    : <span className="modalcloseicon dark" onClick={this.followTopic} ><i className="fas fa-plus-circle"></i> Follow</span>}
            </div>
        )
    }
}

export default Topic

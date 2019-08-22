import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { rootUrl } from '../../config/settings';

export class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            following: this.props.following
        }
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }

    follow = (e) => {
        this.setState({ following: true })
        // post request to follow topicCookies
        const data = {
            user2: this.props.id
        }
        axios.put(rootUrl + "/user/" + Cookies.get("_id") + "/follow_user", data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleFollower ", response.data)
        });
    }

    unfollow = (e) => {
        this.setState({ following: false })
        // post request to unfollow topic
        const data = {
            user2: this.props.id
        }
        axios.put(rootUrl + "/user/" + Cookies.get("_id") + "/unfollow_user", data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleFollower ", response.data)
        });
    }

    render() {
        return (
            <div className="searchresults">
                <Link to={`user/${this.props.id}`} ><img src={rootUrl + this.props.image} alt="profile image" height="30px" width="30px" style={{ borderRadius: "50%" }} /></Link>&nbsp;Profile: &nbsp;
        <Link to={`user/${this.props.id}`} >{this.props.name}</Link>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {this.props.credential}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {(this.state.following)
                    ? <span className="modalcloseicon followicon light" onClick={this.unfollow} ><i className="fas fa-check-circle"></i> Following</span>
                    : <span className="modalcloseicon followicon dark" onClick={this.follow} ><i className="fas fa-plus-circle"></i> Follow</span>}

            </div>
        )
    }
}

export default Profile

import React, { Component } from 'react';
import { FRONTEND_URL, BACKEND_URL } from '../config';
import { Row, Col, Image, Button, Media } from 'react-bootstrap';
import { rootUrl } from '../../config/settings';
import axios from 'axios';

class Following extends Component {
    constructor(props) {
        super(props)
        this.state = {
            following: [],
            diffUserFollowing: [],
            isCurrUser: true
        }

        this.toggleFollow = this.toggleFollow.bind(this)
    }

    componentDidMount() {
        //var token = localStorage.getItem("token");
        var localStorageUserID = localStorage.getItem("userid");
        let userid = this.props.userid;

        //let localStorageUserID = "5cce7ecf1c9d4400005f7b86";
        let CurrUser = false;
        if (localStorageUserID === userid) {
            CurrUser = true;
        }
        axios.get(rootUrl + '/user/' + localStorageUserID + '/following', {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from following ", response.data.data);
                let currUserFollowing = response.data.data.following
                if (!CurrUser) {
                    axios.get(rootUrl + '/user/' + userid + '/following', {
                        //headers: { "Authorization": `Bearer ${token}` }
                    })
                        .then((response) => {
                            console.log("response data for diff user from following ", response.data.data);
                            this.setState({
                                following: currUserFollowing,
                                diffUserFollowing: response.data.data.following,
                                isCurrUser: CurrUser
                            })
                        })
                }
                else {
                    this.setState({
                        following: currUserFollowing,
                        isCurrUser: CurrUser
                    })
                }
            });
    }

    toggleFollow = (e) => {
        //var token = localStorage.getItem("token");
        let index = e.target.id
        console.log("target in startfollowing", e.target.name)
        let userid = this.props.userid
        let putMethod = e.target.name === 'Follow' ? 'follow_user' : 'unfollow_user'

        console.log("following in toggleFollow", this.state.following[index])
        if (this.state.following[index]) {
            let followUserId = this.state.following[index]._id
            console.log("index in startfollowing", index)
            console.log("followers", followUserId)
            const data = {
                user2: followUserId
            }
            axios.put(rootUrl + '/user/' + userid + '/' + putMethod, data, {
                //headers: { "Authorization": `Bearer ${token}` }
            }).then((response) => {
                console.log("response data from toggleFollow ", response.data, putMethod);
                if (putMethod === 'unfollow_user') {
                    console.log("inside putMethod", this.state.following)
                    this.state.following.splice(index, 1)
                    this.setState({
                        following: this.state.following
                    })
                }

            });
        }

    }

    render() {
        let following = []
        if (this.state.isCurrUser) {
            following = this.state.following
        }
        else {
            following = this.state.diffUserFollowing
        }
        if (!following || following.length === 0) {
            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">0 Following</h3></Col>
                    </Row>
                    <Row>
                        <Col ></Col>
                    </Row>
                </div>
            )
        }
        else {
            let details = []
            //let following = this.state.following

            for (let i = 0; i < following.length; i = i + 2) {
                let name1 = "Follow"
                let name2 = "Follow"
                if (this.state.isCurrUser) {
                    name1 = "Following"
                }
                else {
                    let found = this.state.following.filter(f => f._id === following[i]._id)
                    console.log("found in ", i, found)
                    name1 = found.length > 0 ? "Following" : "Follow"
                }
                if (i + 1 < following.length) {
                    if (this.state.isCurrUser) {
                        name2 = "Following"
                    }
                    else {
                        let found = this.state.following.filter(f => f._id === following[i + 1]._id)
                        console.log("found in ", i + 1, found)
                        name2 = found.length > 0 ? "Following" : "Follow"
                    }
                }
                let content = <div >
                    <Media>
                        <Media.Body>
                            <Row id="follower-row">
                                <Col sm={1}>
                                    <Image src={rootUrl + following[i].image} className="img-rounded img-responsive"
                                        alt="not available" height="50" width="50" roundedCircle />
                                </Col>
                                <Col sm={5}>
                                    <Row id="follower-name-row"><h4 className="heading4">{following[i].firstname}&nbsp;{following[i].lastname}</h4></Row>
                                    <Row><h5>{following[i].credential}</h5></Row>
                                </Col>
                                {i + 1 < following.length ? <Col sm={1}>
                                    <Image src={rootUrl + following[i + 1].image} className="img-rounded img-responsive"
                                        alt="not available" height="50" width="50" roundedCircle />
                                </Col> : <Col sm={1}></Col>}
                                {i + 1 < following.length ? <Col sm={5}>
                                    <Row id="follower-name-row"><h4 className="heading4">{following[i + 1].firstname}&nbsp;{following[i + 1].lastname}</h4></Row>
                                    <Row><h5>{following[i + 1].credential}</h5></Row>
                                </Col> : <Col sm={5}></Col>}

                            </Row>
                            <br />
                            {/* <Row id="button-row">
                                <Col className="sm6Col" sm={6}><Button size="sm"><i className="fas fa-user-plus fa-1x navlinkText"></i>&nbsp; Follow &nbsp;{!(following[i].following) ? 0 : following[i].following}</Button></Col>
                                {i + 1 < following.length ? <Col className="sm6Col" sm={6}><Button size="sm"><i className="fas fa-user-plus fa-1x navlinkText"></i>&nbsp; Follow &nbsp;{!(following[i + 1].following) ? 0 : following[i + 1].following}</Button></Col>
                                    : <Col className="sm6Col" sm={6}></Col>}
                            </Row> */}
                            <Row id="button-row">
                                <Col className="sm6Col" sm={6}><Button name={name1} id={i} size="sm" onClick={this.toggleFollow}>
                                    {name1 === 'Following' ? <i name={name1} id={i} className="fas fa-user-check fa-1x navlinkText"></i>
                                        : <i name={name1} id={i} className="fas fa-user-plus fa-1x navlinkText"></i>}&nbsp; {name1} </Button>
                                </Col>
                                {i + 1 < following.length ?
                                    <Col className="sm6Col" sm={6}><Button name={name2} id={i + 1} size="sm" onClick={this.toggleFollow}>
                                        {name2 === 'Following' ? <i name={name2} id={i + 1} className="fas fa-user-check fa-1x navlinkText"></i>
                                            : <i name={name2} id={i + 1} className="fas fa-user-plus fa-1x navlinkText"></i>}&nbsp; {name2} </Button>
                                    </Col>
                                    : <Col className="sm6Col" sm={6}></Col>}
                            </Row>

                        </Media.Body>
                    </Media>

                </div >
                details.push(content)
            }
            console.log("details", details)

            // let following = this.props.following
            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">{this.state.following.length} Following</h3></Col>
                    </Row>
                    <Row>
                        <Col >{details}</Col>
                    </Row>
                </div>
            )
        }
    }
}
export default Following
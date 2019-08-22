import React, { Component } from 'react';
import { Row, Col, Media, Image, Button } from 'react-bootstrap';
import { rootUrl } from '../../config/settings';
import axios from 'axios';

class Followers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            followers: [],
            following: [],
            componentReloaded: true
        }

        this.startFollowing = this.startFollowing.bind(this)
    }

    componentDidMount() {
        //var token = localStorage.getItem("token");
        let userid = this.props.userid;
        axios.get(rootUrl + '/user/' + userid + '/followers', {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from followers ", response.data.data);
                this.setState({ followers: response.data.data.follower })
            });
    }

    startFollowing = (e) => {
        //var token = localStorage.getItem("token");
        let index = e.target.id
        console.log("target in startfollowing", e.target.name)
        let userid = this.props.userid
        let putMethod = e.target.name === 'Follow' ? 'follow_user' : 'unfollow_user'

        console.log("follower in startfollowing", this.state.followers[index])
        if (this.state.followers[index]) {
            let followUserId = this.state.followers[index]._id
            console.log("index in startfollowing", index)
            console.log("followers", followUserId)
            const data = {
                user2: followUserId
            }
            axios.put(rootUrl + '/user/' + userid + '/' + putMethod, data, {
                //headers: { "Authorization": `Bearer ${token}` }
            }).then((response) => {
                console.log("response data from startfollowing ", response.data);
                this.setState({
                    following: response.data.data.following,
                    componentReloaded: false
                })
            });
        }
    }

    render() {
        let following = this.state.following
        if (this.state.componentReloaded && this.props.metadata.following !== 0) {
            following = this.props.metadata.following
        }
        console.log("following from props", following)
        if (this.state.followers.length === 0) {
            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">{this.state.followers.length} Followers</h3></Col>
                    </Row>
                    <Row>
                        <Col ></Col>
                    </Row>
                </div>
            )
        }
        else {
            let details = []
            let followers = this.state.followers
            for (let i = 0; i < followers.length; i = i + 2) {
                let isFollowing1 = following.includes(followers[i]._id)
                let isFollowing2 = false
                let name1 = isFollowing1 ? "Following" : "Follow"
                let name2 = "Follow"
                if (i + 1 < followers.length) {
                    isFollowing2 = following.includes(followers[i + 1]._id)
                    name2 = isFollowing2 ? "Following" : "Follow"
                }
                let content = <div >
                    <Media>
                        <Media.Body>
                            <Row id="follower-row">
                                <Col sm={1}>
                                    <Image src={rootUrl + followers[i].image} className="img-rounded img-responsive"
                                        alt="not available" height="50" width="50" roundedCircle />
                                </Col>
                                <Col sm={5}>
                                    <Row id="follower-name-row"><h4 className="heading4">{followers[i].firstname}&nbsp;{followers[i].lastname}</h4></Row>
                                    <Row><h5>{followers[i].credential}</h5></Row>
                                </Col>
                                {i + 1 < followers.length ? <Col sm={1}>
                                    <Image src={rootUrl + followers[i + 1].image} className="img-rounded img-responsive"
                                        alt="not available" height="50" width="50" roundedCircle />
                                </Col> : <Col sm={1}></Col>}
                                {i + 1 < followers.length ? <Col sm={5}>
                                    <Row id="follower-name-row"><h4 className="heading4">{followers[i + 1].firstname}&nbsp;{followers[i + 1].lastname}</h4></Row>
                                    <Row><h5>{followers[i + 1].credential}</h5></Row>
                                </Col> : <Col sm={5}></Col>}

                            </Row>
                            <br />
                            {/* <Row id="button-row">
                                <Col className="sm6Col" sm={6}><Button id={i} onClick={this.startFollowing} size="sm"><i className="fas fa-user-plus fa-1x navlinkText"></i>&nbsp; Follow &nbsp;{!(followers[i].followers) ? 0 : followers[i].followers}</Button></Col>
                                {i + 1 < followers.length ? <Col className="sm6Col" sm={6}><Button id={i + 1} onClick={this.startFollowing} size="sm"><i className="fas fa-user-plus fa-1x navlinkText"></i>&nbsp; Follow &nbsp;{!(followers[i + 1].followers) ? 0 : followers[i + 1].followers}</Button></Col>
                                    : <Col className="sm6Col" sm={6}></Col>}
                            </Row> */}
                            <Row id="button-row">
                                <Col className="sm6Col" sm={6}><Button name={name1} id={i} onClick={this.startFollowing} size="sm">
                                    {isFollowing1 ? <i name={name1} id={i} className="fas fa-user-check fa-1x navlinkText"></i>
                                        : <i name={name1} id={i} className="fas fa-user-plus fa-1x navlinkText"></i>}&nbsp; {name1} </Button>
                                </Col>
                                {i + 1 < followers.length ?
                                    <Col className="sm6Col" sm={6}><Button name={name2} id={i + 1} onClick={this.startFollowing} size="sm">
                                        {isFollowing2 ? <i name={name2} id={i + 1} className="fas fa-user-check fa-1x navlinkText"></i>
                                            : <i name={name2} id={i + 1} className="fas fa-user-plus fa-1x navlinkText"></i>}&nbsp; {name2}</Button>
                                    </Col>
                                    : <Col className="sm6Col" sm={6}></Col>}
                            </Row>

                        </Media.Body>
                    </Media>

                </div >
                details.push(content)
            }
            console.log("details", details)
            return (
                <div>
                    <Row id="headingRow">
                        <Col ><h3 className="heading3">{this.state.followers.length} Followers</h3></Col>
                    </Row>
                    <Row>
                        {details}
                    </Row>
                </div>
            )
        }
    }
}

export default Followers
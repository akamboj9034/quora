import React, { Component } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

export class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: "5cb8d480c8697f7f386f8fe3",
            email: "parikh.dhruvil18@gmail.com",
            password: "$2b$10$5WOLdwQMEUy1.3LoUS2vfOz76L12D5H0mBT9svq1RonQGi.ibdEQC",
            show: false,
            current_password: "",
            new_password: "",
            rePassword: ""
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleClose() {
        this.setState({ show: false });
    }
    handleShow() {
        this.setState({ show: true });
    }
    currentPasswordChangeHandler(e) {
        this.setState({ current_password: e.target.value });
    }
    newPasswordChangeHandler(e) {
        this.setState({ new_password: e.target.value });
    }
    rePasswordChangeHandler(e) {
        this.setState({ rePassword: e.target.value });
    }

    changePasswordHandler = (e) => {

        const data = {
            user_id: this.state.userid,
            email: this.state.email,
            password: this.state.password,
            current_password: this.state.current_password,
            new_password: this.state.new_password,
            rePassword: this.state.rePassword,
        }
        if (data.new_password !== data.rePassword) {
            alert("Please enter same password !!")
            this.setState({ show: false });
        }
        else {
            this.setState({ show: false });
            console.log("User detail sent to backend for change password is ", data)
            axios.post(`http://localhost:3001/${this.state.userid}/change_password`, data)
                .then((response) => {
                    if (response.data.status === 1) {
                        alert("Action completed.");
                        this.props.history.push("/logout");
                    }
                })
        }
    }
    deleteAccountHandler = (e) => {
        const data = {
            user_id: this.state.userid,
            email: this.state.email,
            password: this.state.password

        }
        console.log("User detail to delete sent to backend is ", data)
        axios.delete(`http://localhost:3001/${this.state.user_id}`, data)
            .then((response) => {
                if (response.data.status === 1) {
                    alert("Action completed.");
                    this.props.history.push("/logout");
                }
            })
    }

    deactivateAccount = (e) => {
        const data = {
            user_id: this.state.userid,
            email: this.state.email,
            password: this.state.password

        }
        console.log("User detail sent to backend is ", data)
        axios.put(`http://localhost:3001/${this.state.userid}/deactivate`, data)
            .then((response) => {
                if (response.data.status === 1) {
                    alert("Action completed.");
                    this.props.history.push("/logout");
                }
            })
    }

    render() {
        return (
            <div className="top_100">
                <Container >
                    <Row>
                        <Col sm={2}></Col>
                        <Col sm={8}>
                            <Modal show={this.state.show} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Change Password!!</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Please enter your current and new password</Modal.Body>
                                <Modal.Body>
                                    <form onSubmit={this.changePasswordHandler}>
                                        <input type="password" name="current password" placeholder="Current Password" onChange={this.currentPasswordChangeHandler.bind(this)} required /><br /><br />
                                        <input type="password" name="new password" placeholder="New Password" onChange={this.newPasswordChangeHandler.bind(this)} required /><br /><br />
                                        <input type="password" name="re password" placeholder="Re-enter New Password" onChange={this.rePasswordChangeHandler.bind(this)} required />
                                        <Button className="btn btn-primary" type="submit">Submit</Button>
                                    </form>
                                </Modal.Body>
                            </Modal>

                            <a href="#" onClick={this.handleShow.bind(this)} ><i className="fa fa-user-circle-o fa-1x navlinkText"></i>  Change Password</a><br />
                            <a href="#" onClick={this.deleteAccountHandler.bind(this)}><i className="fa fa-trash fa-1x navlinkText" ></i>  Delete Account</a><br />
                            <a href="#" onClick={this.deactivateAccount.bind(this)} ><i className="fa fa-arrow-circle-down fa-1x navlinkText" ></i>  Deactivate </a>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Settings

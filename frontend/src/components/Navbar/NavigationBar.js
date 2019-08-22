import React, { Component } from 'react';
import title from "../../public/quora.jpg";
import Scroll from 'react-scroll';
import { Navbar, Nav, NavDropdown, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { rootUrl } from '../../config/settings';
import Cookies from 'js-cookie';

var Element = Scroll.Element;

export class NavigationBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: Cookies.get("_id"),
      searchQuery: null,
      openQuestionModal: false,
      openMsgModal: false,
      openMsgThreadModal: false,
      openNewMsgModal: false,
      question_owner: Cookies.get('_id'),
      question: null,
      topics: [],
      topicsSelected: [],
      msgthreads: [],
      textmsg: "",
      messages: [],
      toName: "",
      toMsg: "",
      conversation_id: "",
      selectedOption: null
    }
    //navbar
    this.searchHandler = this.searchHandler.bind(this);
    this.searchResult = this.searchResult.bind(this);
    //modal
    this.openModel = this.openModel.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openMsgModel = this.openMsgModel.bind(this);
    this.closeMsgModal = this.closeMsgModal.bind(this);
    this.openMsgThreadModel = this.openMsgThreadModel.bind(this);
    this.closeMsgThreadModal = this.closeMsgThreadModal.bind(this);
    this.openNewMsgModal = this.openNewMsgModal.bind(this);
    this.openNewMsgModal = this.openNewMsgModal.bind(this);
    this.closeNewMsgModal = this.closeNewMsgModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addTopic = this.addTopic.bind(this);
    this.removeTopic = this.removeTopic.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.backmodal = this.backmodal.bind(this);
    this.textmsgHandler = this.textmsgHandler.bind(this);
    this.sendMsgHandler = this.sendMsgHandler.bind(this);
    this.toNameHandler = this.toNameHandler.bind(this);
    this.toMsgHandler = this.toMsgHandler.bind(this);
    this.sendNewMsgHandler = this.sendNewMsgHandler.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
  }

  searchHandler = (e) => {
    this.setState({
      searchQuery: e.target.value
    })
  }

  handleInputChange = (e) => {
    if (e.target.checked) this.addTopic(e.target.id)
    else this.removeTopic(e.target.id)
  }

  addTopic = (id) => {
    const topicsSelected = this.state.topicsSelected.concat(id)
    this.setState({ topicsSelected })
  }

  removeTopic = (id) => {
    let topics = []
    Object.assign(topics, this.state.topicsSelected)
    let topicsSelected = topics.filter((t) => { return t !== id })
    this.setState({ topicsSelected })
  }

  submitHandler = (e) => {
    e.preventDefault();
    console.log(this.state.question, this.state.topicsSelected);
    //post request to add question
    const data = {
      question_owner: this.state.question_owner,
      question: this.state.question,
      topic: this.state.topicsSelected
    }
    axios.post(rootUrl + "/question", data)
      .then((result) => {
        console.log(result.data)
        if (result.data.status === 1) alert("Question added successfully.")
        else alert("Something went wrong.")
      })
  }

  searchResult = (e) => {
    if (e.keyCode === 13 && this.state.searchQuery) {
      e.preventDefault();
      console.log(this.state.searchQuery)
      this.props.history.push(`/search?q=${this.state.searchQuery}`)
    }
  }

  textmsgHandler = (e) => {
    this.setState({ textmsg: e.target.value })
  }

  sendMsgHandler = (e) => {
    e.preventDefault();
    let d = new Date();
    d = d.toLocaleDateString() + " " + d.toLocaleTimeString();
    const data = {
      conversation_id: this.state.conversation_id,
      user_id: this.state.question_owner,
      body: this.state.textmsg
    }
    let msgs = []
    Object.assign(msgs, this.state.messages)
    msgs.push(data)
    this.setState({ messages: msgs })
    console.log(data)
    //post message here
    axios.put(rootUrl + "/message/" + this.state.conversation_id, data)
      .then((result) => {
        console.log(result.data);
      })
  }

  sendNewMsgHandler = (e) => {
    e.preventDefault();
    axios.get(rootUrl + '/message/search?q=' + this.state.toName)
      .then((result) => {
        // console.log(result.data.data)
        const to_id = result.data.data[0]
        console.log(to_id)
        if (to_id !== null && to_id !== undefined) {
          const data = {
            user_id: Cookies.get("_id"),
            to: to_id._id,
            sentBy: Cookies.get("_id"),
            body: this.state.textmsg
          }
          axios.post(rootUrl + "/message", data)
            .then((result) => {
              console.log(result.data)
            })
        }
        else {
          alert("Message not sent")
        }
      })
    this.setState({ openNewMsgModal: false })
  }

  toNameHandler = (e) => {
    this.setState({ toName: e.target.value })
  }

  toMsgHandler = (e) => {
    this.setState({ toMsg: e.target.value })
  }

  openModel() {
    this.setState({ openQuestionModal: true });
    axios.get(rootUrl + '/topic')
      .then(response => {
        console.log(response.data)
        this.setState({
          topics: response.data.data
        })
      })
  }

  closeModal() {
    this.setState({ openQuestionModal: false });
  }

  openMsgModel() {
    this.setState({ openMsgModal: true });
    axios.get(rootUrl + "/user/" + Cookies.get("_id") + "/conversations")
      .then((result) => {
        console.log(result.data)
        // get message threads 
        let responseData = result.data
        if (responseData.data !== null) {
          let data = responseData.data
          let msgthreads = []
          for (let d of data) {
            let t = {}
            if (d.members[0]._id !== this.state._id) {
              t.id = d.members[0]._id;
              t.name = d.members[0].firstname + " " + d.members[0].lastname
              t._id = d._id
            }
            else {
              t.id = d.members[1]._id;
              t.name = d.members[1].firstname + " " + d.members[1].lastname
              t._id = d._id
            }
            msgthreads.push(t)
          }
          this.setState({ msgthreads })
        }
      })
  }

  closeMsgModal() {
    this.setState({ openMsgModal: false });
  }

  openMsgThreadModel(e) {
    this.setState({ openMsgModal: false, openMsgThreadModal: true });
    this.setState({ conversation_id: e.target.getAttribute('name') })
    console.log(e.target.getAttribute('name'));
    //get conversation with
    axios.get(rootUrl + "/message/" + e.target.getAttribute('name'))
      .then((result) => {
        console.log(result.data)
        let data = result.data.data.messages;
        this.setState({ messages: data })
      })
  }

  closeMsgThreadModal() {
    this.setState({ openMsgThreadModal: false });
  }

  openNewMsgModal() {
    this.setState({ openMsgModal: false, openNewMsgModal: true })
  }

  closeNewMsgModal() {
    this.setState({ openNewMsgModal: false })
  }

  backmodal() {
    this.setState({
      openMsgModal: true,
      openMsgThreadModal: false,
      openNewMsgModal: false
    })
  }

  logout() {
    Cookies.set("_id", null);
    Cookies.set("session", false);
  }

  render() {

    return (
      <div>
        <header className="navbarheader" >
          <Navbar expand="lg" >
            <Navbar.Brand href="#home"><img src={title} alt="navlogo" className="navlogo" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/home"><i className="fas fa-home"></i>&nbsp;Home</Nav.Link>
                <Nav.Link href="/answer"><i className="fas fa-edit"></i>&nbsp;Answers</Nav.Link>
                <NavDropdown title={<span><i className="fas fa-bell" />&nbsp;Notifications</span>} id="basic-nav-dropdown">
                  <NavDropdown.Item href="#">Notification 1</NavDropdown.Item>
                  <NavDropdown.Item href="#">Notification 2</NavDropdown.Item>
                  <NavDropdown.Item href="#">Notification 3</NavDropdown.Item>
                </NavDropdown>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Form inline >
                  <input type="text" className="form-control" placeholder="Search Quora" onChange={this.searchHandler} onKeyDown={this.searchResult} required />
                </Form>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <NavDropdown title={<i className="fas fa-user"></i>} id="basic-nav-dropdown">
                  <NavDropdown.Item href={"/user/" + this.state._id}>Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={this.openMsgModel} >Messages</NavDropdown.Item>
                  <NavDropdown.Item href="/Content">Your Content</NavDropdown.Item>
                  <NavDropdown.Item href="/stats">Stats</NavDropdown.Item>
                  <NavDropdown.Item href="/Settings">Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/" onClick={this.logout}>Logout</NavDropdown.Item>
                </NavDropdown>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button className="btn btn-danger askquestion" onClick={this.openModel}>Add Question or Link</Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>

        {/* ask question modal */}
        <Modal show={this.state.openQuestionModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="questionmodal">
              <h5>You are asking</h5>
              <form className="signupform" onSubmit={this.submitHandler}>
                <input className="form-control" type="text" placeholder="Start your question with 'What', 'How', 'Why', etc." onChange={(e) => { this.setState({ question: e.target.value }) }} style={{ width: "100%" }} required /><hr />
                Add topics that best describe your question
                    {(this.state.topics).map((resp, index) => {
                  return <div className="checkboxes" key={index}>
                    <input
                      name={resp.name}
                      type="checkbox"
                      id={resp._id}
                      onChange={this.handleInputChange} />
                    <label>{resp.name} </label>
                    <br />
                  </div>
                })}
                <br />
                <input type="submit" name="Add" value="Add Question" style={{ width: "150px" }} className="btn btn-primary" />
                <button className="btn btn-secondary" onClick={this.closeModal}>Cancel</button>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        {/* msg modal */}
        <Modal show={this.state.openMsgModal} onHide={this.closeMsgModal}>
          <Modal.Header style={{ backgroundColor: "rgb(240,240,240)", padding: "15px" }} closeButton >
            <Modal.Title>Messages</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ margin: "0", padding: "0" }}>
            <div className="messagemodal">
              <Element name="test7" className="element" style={{
                position: 'relative',
                height: '300px',
                width: '100%',
                overflow: 'scroll',
              }}>
                {(this.state.msgthreads).map((t, index) => {
                  return <div className="msgthreads" onClick={this.openMsgThreadModel} name={t._id} key={index} >{t.name}</div>
                })}
              </Element>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button className="btn btn-primary" style={{ float: "right" }} onClick={this.openNewMsgModal} >New Message</button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* New msg modal */}
        <Modal show={this.state.openNewMsgModal} onHide={this.closeNewMsgModal}>
          <Modal.Header closeButton>
            <Modal.Title><i className="fas fa-chevron-left modalcloseicon" onClick={this.backmodal} />&nbsp;New Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="newmessagemodal" style={{ height: "300px" }}>
              <form onSubmit={this.sendNewMsgHandler}>
                <input type="text" placeholder="Enter a name" onChange={this.toNameHandler} required />
                <textarea row="5" cols="60" placeholder="Type a message..." onChange={this.toMsgHandler} required /><br />
                <button type="submit" className="btn btn-primary" style={{ float: "right" }} >Send</button>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        {/* msg thread modal */}
        <Modal show={this.state.openMsgThreadModal} onHide={this.closeMsgThreadModal}>
          <Modal.Header closeButton>
            <Modal.Title><i className="fas fa-chevron-left modalcloseicon" onClick={this.backmodal} />&nbsp;Conversation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="messagethreadmodal">
              <Element name="test7" className="element" style={{
                position: 'relative',
                height: '300px',
                width: '100%',
                overflow: 'scroll',
              }}>
                {(this.state.messages).map((m, index) => {
                  return <div key={index}>
                    <strong>{m.sentBy}</strong><span style={{ float: "right" }}>{m.date}</span><br />{m.body}
                  </div>
                })}
              </Element>
            </div>
          </Modal.Body>
          <Modal.Footer id="conversationfooter">
            <div>
              <form onSubmit={this.sendMsgHandler}>
                <input type="text" placeholder="Type a message..." onChange={this.textmsgHandler} style={{ width: "80%" }} required />
                <button className="btn btn-primary" style={{ float: "right", width: "20%" }} >Send</button>
              </form>
            </div>
          </Modal.Footer>
        </Modal>

      </div>
    )
  }
}

export default NavigationBar


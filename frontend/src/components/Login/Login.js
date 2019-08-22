import React, { Component } from 'react';
import ReactModal from 'react-modal';
import Scroll from 'react-scroll';
import title from "../../public/quora.jpg"
import TopicTile from './TopicTile';
import axios from 'axios';
import { rootUrl } from '../../config/settings';
import swal from 'sweetalert';
import Cookies from 'js-cookie';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '500px',
    width: '570px',
    borderRadius: '2%',
    boxShadow: '2px 2px 5px grey'
  }
};

var Element = Scroll.Element;

export class Login extends Component {

  constructor() {
    super();

    this.state = {
      email: null,
      semail: null,
      password: null,
      spassword: null,
      firstname: null,
      lastname: null,
      topics: [],
      topicsSelected: [],
      modalIsOpen: false,
      topicModalIsOpen: false
    };

    this.loginHandler = this.loginHandler.bind(this);
    this.signupHandler = this.signupHandler.bind(this);

    this.openModal = this.openModal.bind(this);
    this.openTopicModal = this.openTopicModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.closeTopicModal = this.closeTopicModal.bind(this);
    this.modifyTopics = this.modifyTopics.bind(this);
    this.addTopic = this.addTopic.bind(this);
    this.removeTopic = this.removeTopic.bind(this);
  }

  componentDidMount() {
    //get topics from db asign it to this.state.topics
    // let response = [
    //   { id: 1, name: "Technology", image: "https://png.pngtree.com/element_origin_min_pic/16/12/16/0958534a4d654dd.jpg"},
    //   { id: 2, name: "Science", image: "https://img.freepik.com/free-vector/science-icon-collection_23-2147504869.jpg?size=338&ext=jpg"},
    //   { id: 3, name: "Movies", image: "https://images.cdn4.stockunlimited.net/clipart/film-camera-icon_2022806.jpg"},
    //   { id: 4, name: "Sports", image: "http://www.paredro.com/wp-content/uploads/2016/04/1-Sport-Icons.jpg"},
    //   { id: 5, name: "Business", image: "https://bettermoneyhabits.bankofamerica.com/content/dam/bmh/khan-thumbnails/Tips-to-save-money-250px-01.jpg.thumb.1280.1280.jpg"},
    //   { id: 6, name: "History", image: "https://st3.depositphotos.com/3268541/12707/v/950/depositphotos_127072292-stock-illustration-history-vector-symbol.jpg"},
    //   { id: 7, name: "Cooking", image: "https://img.freepik.com/free-vector/cooking-utensils-set-vector-illustration_53876-43767.jpg?size=338&ext=jpg"},
    //   { id: 8, name: "Photography", image: "https://i.pinimg.com/originals/aa/f7/26/aaf72696855548fce7180ec85273988a.jpg"},
    //   { id: 9, name: "Education", image: "http://www.soidergi.com/wp-content/uploads/mi/thumb-minimal-logo-graduation-cap-white-background-vector-illustration-design-minimal-logo-graduation-cap-vector-illustration-image.jpg"},
    //   { id: 10, name: "Politics", image: "https://t3.ftcdn.net/jpg/01/96/92/26/500_F_196922693_YHc0Ws3vgRF01nyzQXsYOttriLH7AnbY.jpg"},
    //   { id: 11, name: "Literature", image: "https://irp-cdn.multiscreensite.com/5ea5d4db/dms3rep/multi/mobile/diversity-knowledge-book-tree-132983-diversity-knowledge-book-tree-jpg-e1Wwmf-clipart-1600x1591.jpg"}
    // ]
    axios.get(rootUrl + '/topic')
      .then(response => {
        console.log(response.data)
        this.setState({
          topics: response.data.data
        })
      })


  }

  loginHandler = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    }
    axios.post(rootUrl + "/login", data)
      .then(response => {
        console.log(response.data);
        if (response.data.status === 1) {
          Cookies.set('session', true);
          Cookies.set('_id', response.data.data._id);
          localStorage.setItem('userid', response.data.data._id)
          this.props.history.push("/home");
          window.location.reload();
        }
      })

  }

  signupHandler = (e) => {
    e.preventDefault();
    if (this.state.topicsSelected.length >= 5) {
      const data = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.semail,
        password: this.state.spassword,
        topics: this.state.topicsSelected
      }
      console.log(data);
      axios.post(rootUrl + "/signup", data)
        .then(response => {
          console.log(response.data);
          if (response.data.status === 1) {
            alert("Signup successful!")
            window.location.reload();
            // localStorage.setItem("lastname", "Smith");
          }
        })

    }
    else { swal("Select atleast 5 topics.") }
  }

  modifyTopics = (id, status) => {
    console.log(id)
    if (status) this.addTopic(id)
    else this.removeTopic(id)
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

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  openTopicModal() {
    this.setState({ modalIsOpen: false });
    this.setState({ topicModalIsOpen: true });
  }

  afterOpenModal() { }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  closeTopicModal() {
    this.setState({ topicModalIsOpen: false, topicsSelected: [] });
  }

  render() {

    return (
      <div className="login">
        <div className="loginblock" >
          <img src={title} alt="logo" className="loginlogo" /><br />
          <span className="subtitle">A place to share knowledge and better understand the world</span><br />
          <form className="loginform" onSubmit={this.loginHandler}>
            {/* <span style={{float: "left",fontWeight:"bolder"}}>Login</span> */}
            <input type="email" placeholder="Email" onChange={(e) => { this.setState({ email: e.target.value }) }} required /><br />
            <input type="password" placeholder="Password" onChange={(e) => { this.setState({ password: e.target.value }) }} required /><br />
            <button type="submit" value="Log In" className="btn btn-primary" style={{ width: "300px" }} >Login</button><br />
          </form>
          <button className="btn btn-danger" onClick={this.openModal} style={{ width: "300px" }}>Sign Up</button>
          <ReactModal
            isOpen={this.state.modalIsOpen}
            contentLabel="Signup Modal"
            style={customStyles}
          >
            <i className="fas fa-times-circle modalcloseicon" onClick={this.closeModal} style={{ float: "right" }}></i><br />
            {/* <button className="btn btn-secondary" onClick={this.closeModal} style={{float:"right"}}>x</button> */}
            <div className="signup">
              <h4>Please enter your details</h4>
              <form className="signupform" onSubmit={this.openTopicModal}>
                <input type="text" placeholder="First name" onChange={(e) => { this.setState({ firstname: e.target.value }) }} required /><br />
                <input type="text" placeholder="Last name" onChange={(e) => { this.setState({ lastname: e.target.value }) }} required /><br />
                <input type="email" placeholder="Email" onChange={(e) => { this.setState({ semail: e.target.value }) }} required /><br />
                <input type="password" placeholder="Password" onChange={(e) => { this.setState({ spassword: e.target.value }) }} required /><br />
                <input type="submit" name="Next" value="Next" style={{ width: "300px" }} className="btn btn-primary" />
              </form>
            </div>
          </ReactModal>

          <ReactModal
            isOpen={this.state.topicModalIsOpen}
            contentLabel="Signup Modale"
            style={customStyles}
          >
            <i className="fas fa-times-circle modalcloseicon" onClick={this.closeTopicModal} style={{ float: "right" }}></i><br />
            {/* <button className="btn btn-secondary" onClick={this.closeTopicModal} style={{ float: "right" }}>x</button><br /> */}
            <div className="signuptopic">
              <h4>What are your interests?</h4>
              <h5>Select 5 topics to continue</h5>
              <Element name="test7" className="element" id="containerElement" style={{
                position: 'relative',
                height: '320px',
                overflow: 'scroll',
              }}>
                <div className="topictiles" >
                  {(this.state.topics || []).map((topic, index) => {
                    return <TopicTile id={topic._id} name={topic.name} image={topic.image} callback={this.modifyTopics} key={index} />
                  })}
                </div>
              </Element>
              <button onClick={this.signupHandler} className="btn btn-primary" style={{ float: "right" }} >Continue</button>
            </div>
          </ReactModal>
        </div>
      </div>
    )
  }
}

export default Login

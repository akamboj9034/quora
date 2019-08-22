import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Collapse } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { rootUrl } from '../../config/settings';

const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'image'
]

export class QuestionComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      following: this.props.following,
      open: false,
      answer: ""
    }
    this.openCollapse = this.openCollapse.bind(this);
    this.closeCollapse = this.closeCollapse.bind(this);
    this.followQuestion = this.followQuestion.bind(this);
    this.unfollowQuestion = this.unfollowQuestion.bind(this);
    this.answerHandler = this.answerHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this)
    // this.updateAnswer = this.updateAnswer.bind(this)
  }

  handleEditorChange(value) {
    console.log("new formatted data", value)
    this.setState({
      text: value,
      answer: value
    })

  }
  followQuestion = (e) => {
    this.setState({ following: true })
    // post request to follow topic
  }

  unfollowQuestion = (e) => {
    this.setState({ following: false })
    // post request to unfollow topic
  }

  openCollapse = (e) => {
    this.setState({ open: true });
  }

  closeCollapse = (e) => {
    this.setState({ open: false });
  }

  answerHandler = (e) => {
    this.setState({ answer: e.target.value })
  }

  submitHandler = (e) => {
    e.preventDefault();
    this.setState({ open: false, answer: "" })
    // navigate to that question page
  }

  updateAnswer = (e) => {
    e.preventDefault()
    //var token = localStorage.getItem("token");
    const data = {
      answer: this.state.answer,
      answer_owner: "Current User Name",
      question: this.props.id
    }
    let userid = this.props.match.params.userid;
    axios.put(rootUrl + '/answer', data, {
      //headers: { "Authorization": `Bearer ${token}` }
    }).then((response) => {
      console.log("response data from description ", response.data)
      this.setState({
        showInlineEditor: false,
        editorClass: 'edit_desc_name'
      })
    });
  }
  render() {
    return (
      <div className="emptyquestion">
        <Link to={`/question/${this.props.id}`} ><span className="quorafont">{this.props.question}</span><br /></Link>
        <Button variant="light" onClick={this.openCollapse}><i className="fas fa-edit"></i>Answer</Button>
        {(this.state.following)
          ? <Button variant="light" onClick={this.unfollowQuestion} ><i className="fas fa-check-circle"></i> Following</Button>
          : <Button variant="light" onClick={this.followQuestion}><i className="fas fa-plus-circle"></i> Follow</Button>}

        <Collapse in={this.state.open}>
          <div id="example-collapse-text">
            <ReactQuill
              onChange={this.handleEditorChange}
              value={this.state.answer}
              modules={modules}
              formats={formats}
            />
            {/* <Form onSubmit={this.submitHandler}>
            <textarea row="5" cols="90" onChange={this.answerHandler} required />
            <Button type="submit">Submit</Button>&nbsp;
            <Button onClick={this.closeCollapse} >Close</Button>
            </Form> */}
            <br />
            <Button type="close" variant="light" size="sm" onClick={this.closeCollapse}>Cancel</Button> &nbsp;
            <Button type="submit" variant="info" size="sm" onClick={this.updateAnswer}>Update</Button>
            <br /><br />
          </div>
        </Collapse>
      </div>
    )
  }
}

export default QuestionComponent

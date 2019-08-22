import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Nav, Container, Row, Col, Navbar as Bar, Image, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Input } from 'reactstrap';
import Answers from './Answers';
import './User.css';
import Questions from './Questions';
import Followers from './Followers';
import Following from './Following';
import Activity from './Activity';
import Select from 'react-select';
import { rootUrl } from '../../config/settings';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usastate } from '../../config/dropdownValues'

const minOffset = 0;
const maxOffset = 60;

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        //['link', 'image', 'video'],
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

class User extends Component {
    constructor(props) {
        super(props);
        const thisYear = (new Date()).getFullYear();
        this.state = {
            email: '',
            firstname: '',
            lastname: '',
            city: '',
            state: '',
            zipcode: '',
            image: '',
            education: [],
            career: [],
            description: '',
            credentials: '',
            topic: [],
            question: [],
            answer: [],
            upvote: 0,
            downvote: 0,
            follower: 0,
            following: 0,
            followed_question: 0,
            activity: [],
            showInlineEditor: false,
            showCredEditor: false,
            showEmpCredEditor: false,
            showEduCredEditor: false,
            showLocCredEditor: false,
            showImageEditor: false,
            showUpdateEduCredEditor: false,
            showUpdateEmpCredEditor: false,
            thisYear: thisYear,
            selectedYear: thisYear,
            start_year: '',
            end_year: '',
            position: '',
            company: '',
            school: '',
            career_id: '',
            isCurrent: false,
            concentration: '',
            secConcentration: '',
            degree: '',
            selectedGradYear: '',
            education_id: '',
            displaynameclass: 'user_name',
            fullnameClass: 'edit_user_name',
            name: '',
            selectedLocStartYear: '',
            selectedLocEndYear: '',
            showTopicEditor: false,
            allTopics: [],
            selectedOption: null,
            selectedIndex: -1,
            isCurrUser: false,
            text: '',
            editorClass: 'edit_desc_name',
            file: null,
            bookmark: []
        }

        //localStorage.setItem("userid", "5cce7ecf1c9d4400005f7b86");

        this.applyState = this.applyState.bind(this)
        this.updateDescription = this.updateDescription.bind(this)
        this.toggleDescEditor = this.toggleDescEditor.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggleCredEditor = this.toggleCredEditor.bind(this)
        this.toggleImageEditor = this.toggleImageEditor.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.closeEditor = this.closeEditor.bind(this)
        this.saveCredential = this.saveCredential.bind(this)
        this.saveImage = this.saveImage.bind(this)
        this.credHandler = this.credHandler.bind(this)
        this.nameChange = this.nameChange.bind(this)
        this.toggleEmpCredEditor = this.toggleEmpCredEditor.bind(this)
        this.saveEmpCredential = this.saveEmpCredential.bind(this)
        this.positionHandler = this.positionHandler.bind(this)
        this.companyHandler = this.companyHandler.bind(this)
        this.onHandleStartDateChange = this.onHandleStartDateChange.bind(this)
        this.onHandleEndDateChange = this.onHandleEndDateChange.bind(this)
        this.schoolHandler = this.schoolHandler.bind(this)
        this.concentHandler = this.concentHandler.bind(this)
        this.secondConcentHandler = this.secondConcentHandler.bind(this)
        this.degreeHandler = this.degreeHandler.bind(this)
        this.onHandleGradYear = this.onHandleGradYear.bind(this)
        this.saveEduCredential = this.saveEduCredential.bind(this)
        this.saveTopic = this.saveTopic.bind(this)
        this.toggleEnableName = this.toggleEnableName.bind(this)
        this.updateName = this.updateName.bind(this)
        this.nameHandler = this.nameHandler.bind(this)
        this.toggleEduCredEditor = this.toggleEduCredEditor.bind(this)
        this.toggleEmpCredEditor = this.toggleEmpCredEditor.bind(this)
        this.toggleLocCredEditor = this.toggleLocCredEditor.bind(this)
        this.locationHandler = this.locationHandler.bind(this)
        this.onHandleStartYear = this.onHandleStartYear.bind(this)
        this.onHandleEndYear = this.onHandleEndYear.bind(this)
        this.saveLocCredential = this.saveLocCredential.bind(this)
        this.toggleTopicEditor = this.toggleTopicEditor.bind(this)
        this.handleTopicChange = this.handleTopicChange.bind(this)
        this.editEducation = this.editEducation.bind(this)
        this.editCareer = this.editCareer.bind(this)
        this.removeEducation = this.removeEducation.bind(this)
        this.removeCareer = this.removeCareer.bind(this)
        this.saveUpdateEduCredential = this.saveUpdateEduCredential.bind(this)
        this.saveUpdateEmpCredential = this.saveUpdateEmpCredential.bind(this)
        this.deleteTopic = this.deleteTopic.bind(this)
        this.sortArray = this.sortArray.bind(this)
        this.handleCurrentChange = this.handleCurrentChange.bind(this)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.cityHandler = this.cityHandler.bind(this)
        this.stateHandler = this.stateHandler.bind(this)
        this.zipcodeHandler = this.zipcodeHandler.bind(this)
        this.handleFile = this.handleFile.bind(this)
        this.toggleFollower = this.toggleFollower.bind(this)
    }

    handleTopicChange = (selectedOption) => {
        // console.log(`selectedOption`, selectedOption);
        // console.log(`new selected topics:`, this.state.topic);
        this.setState({
            selectedOption: selectedOption
        })
    }

    applyState = (data, topics, CurrUser) => {
        this.setState({
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            image: !data.image ? "/public/uploads/profilephoto/blank.jpeg" : data.image,
            education: data.education,
            career: data.career,
            description: data.description,
            credentials: data.credential,
            topic: data.topic,
            question: data.question,
            answer: data.answer,
            upvote: data.upvote,
            downvote: data.downvote,
            follower: data.follower,
            following: data.following,
            followed_question: data.followed_question,
            allTopics: topics,
            isCurrUser: CurrUser,
            bookmark: data.bookmark
        });
    }

    componentDidMount() {
        console.log("inside did mount of user")

        // var token = localStorage.getItem("token");

        var localStorageUserID = localStorage.getItem("userid");
        let userid = this.props.match.params.userid;
        //let localStorageUserID = "5cce7ecf1c9d4400005f7b86";
        let CurrUser = false;
        if (localStorageUserID === userid) {
            CurrUser = true;
        }
        axios.get(rootUrl + '/user/' + userid, {
            //headers: { "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                console.log("response data from user profile", response.data);
                let profileData = response.data.data
                axios.get(rootUrl + '/topic', {
                    // headers: { "Authorization": `Bearer ${token}` }
                })
                    .then((response) => {
                        console.log("response data in allTopics", response.data.data);
                        this.applyState(profileData, response.data.data, CurrUser)
                    });
            });

        if (!CurrUser) {
            axios.put(rootUrl + '/user/' + userid + '/view', {
                //headers: { "Authorization": `Bearer ${token}` }
            }).then((response) => {
                console.log("response data from viewProfile ", response.data)
            });
        }
    }

    handleFile = (e) => {
        e.preventDefault()
        this.setState({
            file: e.target.files[0]
        })
    }
    updateDescription = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        const data = {
            description: this.state.description
        }
        let userid = this.props.match.params.userid;
        axios.put(rootUrl + '/user/' + userid + '/description', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from description ", response.data)
            this.setState({
                showInlineEditor: false,
                editorClass: 'edit_desc_name'
            })
        });
    }

    handleChange = (value) => {
        this.setState({
            tempDesc: value
        })
    }

    toggleDescEditor = () => {
        this.setState({
            //showInlineEditor: true,
            editorClass: 'edit_desc_name_enabled'
        })
    }

    closeEditor = () => {
        this.setState({
            showInlineEditor: false
        })
    }

    toggleCredEditor = () => {
        this.setState({
            showCredEditor: true
        })
    }

    toggleEmpCredEditor = () => {
        this.setState({
            showEmpCredEditor: true
        })
    }

    toggleEduCredEditor = () => {
        this.setState({
            showEduCredEditor: true
        })
    }

    toggleImageEditor = () => {
        this.setState({
            showImageEditor: true
        })
    }

    toggleLocCredEditor = () => {
        this.setState({
            showLocCredEditor: true
        })
    }

    toggleTopicEditor = () => {
        this.setState({
            showTopicEditor: true
        })
    }

    handleClose() {
        this.setState({
            showCredEditor: false,
            showEmpCredEditor: false,
            showEduCredEditor: false,
            showLocCredEditor: false,
            showImageEditor: false,
            fullnameClass: 'edit_user_name',
            displaynameclass: 'user_name',
            showTopicEditor: false,
            showInlineEditor: false,
            showUpdateEduCredEditor: false,
            showUpdateEmpCredEditor: false,
            editorClass: 'edit_desc_name'
        });
    }

    credHandler = (e) => {
        this.setState({ credentials: e.target.value });
    }

    descHandler = (e) => {
        this.setState({ description: e.target.value });
    }

    positionHandler = (e) => {
        this.setState({ position: e.target.value });
    }

    companyHandler = (e) => {
        this.setState({ company: e.target.value });
    }


    saveCredential = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        const data = {
            credential: this.state.credentials
        }
        let userid = this.props.match.params.userid;


        axios.put(rootUrl + '/user/' + userid + '/credential', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveCredential ", response.data)
            this.setState({
                showEmpCredEditor: false
            })
        });
    }

    saveImage = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        const data = new FormData()
        data.append('image', this.state.file)
        data.append('imageName', this.state.file.name)
        let userid = this.props.match.params.userid;

        axios.put(rootUrl + '/user/' + userid + '/image', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveImage ", response.data)
            this.setState({
                image: response.data.data.image
            })
        });

    }


    handleCurrentChange = (e) => {
        this.setState({
            isCurrent: e.target.checked
        })
    }

    saveEmpCredential = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        const data = {
            position: this.state.position,
            company: this.state.company,
            start_year: this.state.start_year,
            end_year: this.state.end_year,
            current: this.state.isCurrent
        }
        console.log("saveEmpCredential", data)
        let userid = this.props.match.params.userid;
        axios.put(rootUrl + '/user/' + userid + '/career', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveEmpCredential ", response.data)
            //console.log("sortedArray", this.sortArray(response.data.data.career, "career"))
            this.setState({
                career: response.data.data.career
            })
        });
    }

    sortArray = (type) => {
        if (type === 'career') {
            this.state.career.sort(function (a, b) { return b.end_year - a.end_year })
            this.state.career.sort(function (a, b) { return b.current - a.current })
        }
        else {
            this.state.education.sort(function (a, b) { return b.graduation_year - a.graduation_year })
        }

    }

    nameChange = (e) => {
        console.log("inside nameChange", e.target.value)
    }

    onHandleStartDateChange = (e) => {
        this.setState({ start_year: e.target.value });
    }

    onHandleEndDateChange = (e) => {
        this.setState({ end_year: e.target.value });
    }

    schoolHandler = (e) => {
        this.setState({ school: e.target.value })
    }

    concentHandler = (e) => {
        this.setState({ concentration: e.target.value })
    }

    secondConcentHandler = (e) => {
        this.setState({ secConcentration: e.target.value })
    }

    degreeHandler = (e) => {
        this.setState({ degree: e.target.value })
    }

    onHandleGradYear = (e) => {
        this.setState({ selectedGradYear: e.target.value })
    }


    saveEduCredential = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        const data = {
            school: this.state.school,
            concentration: this.state.concentration,
            secConcentration: this.state.secConcentration,
            graduation_year: this.state.selectedGradYear
        }

        console.log("saveEduCredential", data)
        let userid = this.props.match.params.userid;
        axios.put(rootUrl + '/user/' + userid + '/education', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveEduCredential ", response.data)
            this.setState({
                education: response.data.data.education,
                showEduCredEditor: false
            })
        });
    }

    saveUpdateEduCredential = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        let education_id = this.state.education_id
        const data = {
            school: this.state.school,
            concentration: this.state.concentration,
            secConcentration: this.state.secConcentration,
            graduation_year: this.state.selectedGradYear,
            degree: this.state.degree
        }
        console.log("saveUpdateEduCredential", data)
        let userid = this.props.match.params.userid;
        axios.put(rootUrl + '/user/' + userid + '/education/' + education_id, data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveUpdateEduCredential ", response.data)
            this.setState({
                education: response.data.data.education,
                showUpdateEduCredEditor: false,
                selectedIndex: -1,
                school: '',
                degree: '',
                concentration: '',
                selectedGradYear: ''
            })
        });
    }

    saveUpdateEmpCredential = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        let index = this.state.selectedIndex
        console.log("inside saveUpdateEmp", index)
        console.log("this.state.career", this.state.career)
        let career_id = this.state.career_id
        const data = {
            position: this.state.position,
            company: this.state.company,
            start_year: this.state.start_year,
            end_year: this.state.end_year,
            current: this.state.isCurrent
        }
        console.log("saveUpdateEmpCredential", data)
        let userid = this.props.match.params.userid;
        axios.put(rootUrl + '/user/' + userid + '/career/' + career_id, data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveUpdateEmpCredential ", response.data)
            this.setState({
                career: response.data.data.career,
                showUpdateEmpCredEditor: false,
                selectedIndex: -1,
                position: '',
                company: '',
                start_year: '',
                end_year: ''
            })
        });
    }

    toggleEnableName = () => {
        this.setState({
            fullnameClass: 'edit_user_name_enabled',
            displaynameclass: 'user_name_disabled'
        })
    }

    nameHandler = (e) => {
        console.log('inside namehandler', e.target.value)
        this.setState({
            name: e.target.value
        })
    }

    updateName = (e) => {
        //var token = localStorage.getItem("token");
        let userid = this.props.match.params.userid;
        console.log("fullname", this.state.name)
        let fullname = this.state.name.trim()
        let firstname = fullname.substr(0, fullname.indexOf(' '))
        let lastname = fullname.substr(fullname.indexOf(' ') + 1)
        let email = this.state.email

        console.log("firstname and lastname", firstname, lastname)

        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email
        }

        axios.put(rootUrl + '/user/' + userid + '/name', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from updateName ", response.data);
            this.setState({
                fullnameClass: 'edit_user_name',
                displaynameclass: 'user_name',
                firstname: firstname,
                lastname: lastname
            })
        });
    }

    locationHandler = (e) => {
        let location = e.target.value;
        //TODO extract city, state ,zipcode
    }

    onHandleStartYear = (e) => {
        this.setState({ selectedLocStartYear: e.target.value })
    }

    onHandleEndYear = (e) => {
        this.setState({ selectedLocEndYear: e.target.value })
    }

    saveLocCredential = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        const data = {
            city: this.state.city,
            state: this.state.state,
            zipcode: this.state.zipcode
        }
        let userid = this.props.match.params.userid;
        console.log("saveLocCredential", data)
        axios.put(rootUrl + '/user/' + userid + '/location', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveLocCredential ", response.data);
            this.setState({ showLocCredEditor: false })
        });
    }

    saveTopic = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");
        console.log(`selectedOption in save topic`, this.state.selectedOption);
        let temp = []
        let topicIds = []
        for (let i = 0; i < this.state.selectedOption.length; i++) {
            temp.push({
                name: this.state.selectedOption[i].value,
                image: this.state.selectedOption[i].label.props.children[0].props.src
            })
            topicIds.push(this.state.selectedOption[i].id)
        }

        console.log("temp ", this.state.topic)
        console.log(`Option selected:`, this.state.selectedOption);
        const data = { topic: topicIds }
        let userid = this.props.match.params.userid;
        axios.put(rootUrl + '/user/' + userid + '/topic', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from saveTopic ", response.data);
            this.setState({
                topic: this.state.topic.concat(temp),
                showTopicEditor: false,
                selectedOption: ''
            })
        });
    }

    removeEducation = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");    
        let index = e.target.id
        let education_id = this.state.education[index]._id
        const data = {
            school: this.state.education[index].school,
            concentration: this.state.education[index].concentration,
            graduation_year: this.state.education[index].selectedGradYear,
            degree: this.state.education[index].degree
        }
        console.log("removeEducation", data)
        let userid = this.props.match.params.userid;
        axios.delete(rootUrl + '/user/' + userid + '/education/' + education_id, data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from removeEducation ", response.data)
            this.setState({
                education: response.data.data.education,
                showUpdateEduCredEditor: false,
                selectedIndex: -1,
                school: '',
                degree: '',
                concentration: '',
                selectedGradYear: ''
            })
        });
    }

    removeCareer = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");    
        let index = e.target.id
        let career_id = this.state.career[index]._id
        const data = {
            position: this.state.career[index].position,
            company: this.state.career[index].company,
            start_year: this.state.career[index].start_year,
            end_year: this.state.career[index].end_year,
            current: this.state.career[index].isCurrent
        }

        console.log("removeCareer", data)
        let userid = this.props.match.params.userid;
        axios.delete(rootUrl + '/user/' + userid + '/career/' + career_id, data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from removeCareer ", response.data)
            this.setState({
                career: response.data.data.career,
                showUpdateEmpCredEditor: false,
                selectedIndex: -1,
                position: '',
                company: '',
                start_year: '',
                end_year: ''
            })
        });
    }


    editCareer = (e) => {
        e.preventDefault()
        let index = e.target.id
        console.log("inside editCareer", this.state.career, index)
        this.setState({
            position: this.state.career[index].position,
            company: this.state.career[index].company,
            start_year: this.state.career[index].start_year,
            end_year: this.state.career[index].end_year,
            career_id: this.state.career[index]._id,
            isCurrent: this.state.career[index].current,
            showUpdateEmpCredEditor: true,
            showEmpCredEditor: false,
            selectedIndex: index
        })
    }

    editEducation = (e) => {
        e.preventDefault()
        let index = e.target.id
        this.setState({
            school: this.state.education[index].school,
            concentration: this.state.education[index].concentration,
            degree: this.state.education[index].degree,
            selectedGradYear: this.state.education[index].graduation_year,
            education_id: this.state.education[index]._id,
            showUpdateEduCredEditor: true,
            showEduCredEditor: false,
            selectedIndex: index
        })
    }

    deleteTopic = (e) => {
        e.preventDefault()
        //var token = localStorage.getItem("token");    
        let index = e.target.id

        console.log("index in delete topic", index)
        console.log("topic", this.state.topic)
        let topic_id = this.state.topic[index]._id
        let userid = this.props.match.params.userid
        const data = {
            name: this.state.topic[index].name
        }
        axios.put(rootUrl + '/user/' + userid + '/topic/' + topic_id + '/unfollow', data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from removeEducation ", response.data)
            this.state.topic.splice(index, 1)
            this.setState({
                topic: this.state.topic
            })
        });
    }

    handleEditorChange(value) {
        console.log("new formatted data", value)
        this.setState({
            text: value,
            description: value
        })

    }

    cityHandler = (e) => {
        this.setState({ city: e.target.value })
    }

    stateHandler = (e) => {
        this.setState({ state: e.target.value })
    }

    zipcodeHandler = (e) => {
        this.setState({ zipcode: e.target.value })
    }

    toggleFollower = (e) => {
        let user2 = this.props.match.params.userid
        let userid = localStorage.getItem("userid")
        let putMethod = e.target.name === 'Follow' ? 'follow_user' : 'unfollow_user'
        const data = {
            user2: user2
        }
        axios.put(rootUrl + '/user/' + userid + '/' + putMethod, data, {
            //headers: { "Authorization": `Bearer ${token}` }
        }).then((response) => {
            console.log("response data from toggleFollower ", response.data);
            if (putMethod === 'follow_user') {
                this.state.follower.push(userid)
            }
            else {
                this.state.follower.splice(this.state.follower.indexOf(userid), 1);
            }
            this.setState({
                follower: this.state.follower
            })
        });
    }

    render() {

        let followUnfollow = "Follow"
        let localId = localStorage.getItem("userid")
        if (this.state.follower !== 0 && this.state.follower.length > 0) {
            followUnfollow = this.state.follower.includes(localId) ? "Following" : "Follow"
        }

        const topicsoptions = [];
        this.state.allTopics.map(allTopic => {
            let item = this.state.topic.find(
                item => item.name === allTopic.name
            )
            if (!item) {
                topicsoptions.push({
                    "value": allTopic.name,
                    "label": <div>
                        <Image src={allTopic.image}
                            alt="not available" height="25" width="25" />{allTopic.name}
                    </div>,
                    "id": allTopic._id
                })
            }

        })

        const stateOptions = []
        stateOptions.push(<option value=''>Select a state</option>)
        for (let key in usastate) {
            stateOptions.push(<option id={key} value={usastate[key]}>{usastate[key]}</option>)
        }

        const { selectedOption } = this.state;

        let userid = this.props.match.params.userid;
        let baseUrl = "/user/" + userid

        const options = [];
        options.push(<option value=''></option>);
        for (let i = minOffset; i <= maxOffset; i++) {
            const year = this.state.thisYear - i;
            options.push(<option value={year}>{year}</option>);
        }

        let fullname = this.state.firstname + ' ' + this.state.lastname;
        let location = this.state.city + ' , ' + this.state.state + ' - ' + this.state.zipcode;
        let metadata = {
            owner: fullname,
            image: this.state.image,
            downvote: this.state.downvote,
            upvote: this.state.upvote,
            following: this.state.following,
            profileCred: this.state.credentials,
            bookmark: this.state.bookmark
        }
        let details = ''
        if (this.state.topic.length === 0) {
            details =
                <div id="my-div" onClick={this.toggleTopicEditor}>
                    <i class="fas fa-plus-circle fa-2x text-primary" ></i><br />
                    What topics do you know about?</div>

        }
        else {
            details = this.state.topic.map((topics, index) => {
                return (
                    <div>
                        <Row>
                            <Col sm={3}><Image src={topics.image} height="40" width="40" roundedCircle /></Col>
                            <Col sm={9}>{topics.name} &nbsp; &nbsp;<a href="#" id={index} onClick={this.deleteTopic}>
                                <i id={index} className="fa fa-close fa-1x text-secondary" ></i></a></Col>
                        </Row>
                        <br />
                    </div>
                )
            })
        }

        let careerDetails = ''
        if (this.state.career.length === 0) { }
        else {
            this.sortArray("career")
            careerDetails = this.state.career.map((careerInfo, index) => {
                return (
                    <Row id="modal-row">
                        <i className="fas fa-graduation-cap fa-1x navlinkText"></i>{careerInfo.position}
                        &nbsp;at {careerInfo.company} &nbsp;({careerInfo.start_year}-{careerInfo.end_year})
                       &nbsp;<a href="#" id={index} onClick={this.editCareer}>Edit</a> &nbsp;<a href="#" id={index} onClick={this.removeCareer}> Delete</a>
                        <br />
                    </Row>
                )
            })
        }

        let educationDetails = ''
        if (this.state.education.length === 0) { }
        else {
            this.sortArray("education")
            educationDetails = this.state.education.map((education, index) => {
                return (
                    <Row id="modal-row">
                        <i className="fas fa-graduation-cap fa-1x navlinkText"></i> {education.degree}
                        &nbsp;{education.concentration}, {education.school}, ({education.graduation_year})
                      <a href="#" id={index} onClick={this.editEducation}>Edit</a> &nbsp;<a href="#" id={index} onClick={this.removeEducation}> Delete</a>
                        <br />
                    </Row>
                )
            })
        }


        return (
            <div>
                {/* <Navbar /> */}
                <Container id="profileContainer">
                    <Row>
                        <Col sm={9}>
                            <Row id="row1">
                                <Col sm={2}>
                                    <div className="profileHover">
                                        <Image src={rootUrl + this.state.image} className="img-rounded img-responsive"
                                            alt="not available" height="135" width="135" roundedCircle />
                                        <a href="#" onClick={this.toggleImageEditor}>Edit</a>
                                    </div>
                                </Col>
                                <Col id="smallCol"></Col>
                                <Col sm={9}>
                                    <Row>
                                        <div className={this.state.displaynameclass}>
                                            <span >{fullname}&nbsp;&nbsp;</span>
                                        </div>
                                        <div className={this.state.fullnameClass}>
                                            <input type="text" defaultValue={fullname} onChange={this.nameHandler}></input>&nbsp;
                                            <Button type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                            <Button type="submit" variant="info" size="sm" onClick={this.updateName}>Update</Button>
                                        </div>
                                        {this.state.isCurrUser ?
                                            <span className='edit_hover_class'><a href="#" onClick={this.toggleEnableName}>Edit</a></span>
                                            : null}
                                    </Row>
                                    <Row>
                                        {this.state.isCurrUser ?
                                            <span>
                                                {this.state.credentials === '' ?
                                                    <a href="#credEditor" onClick={this.toggleCredEditor}>Add Profile Credential</a> :
                                                    <div> <span className="profileInfo"> {this.state.credentials} </span>
                                                        &nbsp;<span className='edit_hover_class_cred'><a href="#" onClick={this.toggleCredEditor}>Edit</a></span></div>}
                                            </span> :
                                            <span>
                                                {this.state.credentials === '' || !this.state.credentials ?
                                                    <span>No Profile Credential</span> :
                                                    <div> <span className="profileInfo"> {this.state.credentials} </span></div>}
                                            </span>}
                                    </Row>
                                    <Row>
                                        {this.state.isCurrUser ?
                                            <span>
                                                {this.state.description === '' ?
                                                    <a href="#descEditor" onClick={this.toggleDescEditor}>
                                                        Write a description about yourself</a> :
                                                    <div>
                                                        <span><div className="userDesc" dangerouslySetInnerHTML={{ __html: this.state.description }} /></span> &nbsp;
                                                        <span className='edit_hover_class_cred'><a href="#" onClick={this.toggleDescEditor}>Edit</a></span>
                                                    </div>}

                                                <div className={this.state.editorClass}>
                                                    <ReactQuill
                                                        onChange={this.handleEditorChange}
                                                        defaultValue={this.state.description}
                                                        modules={modules}
                                                        formats={formats}
                                                    />
                                                    <br />
                                                    <Button type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                    <Button type="submit" variant="info" size="sm" onClick={this.updateDescription}>Update</Button>
                                                    <br /><br />
                                                </div>
                                            </span> :
                                            <span>
                                                {this.state.description === '' || !this.state.description ?
                                                    <span> No description yet</span> :
                                                    <div> <span className="userDesc"> <p dangerouslySetInnerHTML={{ __html: this.state.description }} /> </span></div>}
                                            </span>}

                                    </Row>

                                    <Row id="button-row">{this.state.isCurrUser === true ?
                                        <span><b> {this.state.follower.length} Followers</b></span> :
                                        <span><Button name={followUnfollow} size="sm" onClick={this.toggleFollower}>
                                            {followUnfollow === 'Follow' ? <i className="fas fa-user-plus fa-1x navlinkText"></i> : <i className="fas fa-user-check fa-1x navlinkText"></i>}&nbsp;
                                             {followUnfollow} &nbsp;{this.state.follower.length}</Button></span>}
                                    </Row>
                                </Col>

                            </Row>
                            <Row id="row3">
                                <Col sm={2}>
                                    <Row id="headingRow">
                                        <Col ><h3 className="heading3">Feeds</h3></Col>
                                    </Row>
                                    <Row>
                                        <Bar expand="lg" role="sub">
                                            <Nav role="navigation" className="flex-column">
                                                <Nav.Link eventKey="Answers" href={`${baseUrl}/Answers`}><span className="navlinkText">Answers {this.state.answer.length}</span><span></span></Nav.Link>
                                                <Nav.Link eventKey="Questions" href={`${baseUrl}/Questions`}><span className="navlinkText">Questions {this.state.question.length}</span><span></span></Nav.Link>
                                                <Nav.Link eventKey="Followers" href={`${baseUrl}/Followers`}><span className="navlinkText">Followers {this.state.follower.length}</span></Nav.Link>
                                                <Nav.Link eventKey="Following" href={`${baseUrl}/Following`}><span className="navlinkText"><span>Following {this.state.following.length}</span></span></Nav.Link>
                                                <Nav.Link eventKey="Activity" href={`${baseUrl}/Activity`}><span className="navlinkText">Activity</span></Nav.Link>
                                            </Nav>
                                        </Bar>
                                    </Row>
                                </Col>
                                <Col id="smallCol"></Col>
                                <Col sm={9}>
                                    <Route path={`${baseUrl}/Answers`} render={(props) => <Answers {...props} userid={userid} metadata={metadata} />} />
                                    <Route path={`${baseUrl}/Questions`} render={(props) => <Questions {...props} userid={userid} metadata={metadata} />} />
                                    <Route path={`${baseUrl}/Followers`} render={(props) => <Followers {...props} userid={userid} metadata={metadata} />} />
                                    <Route path={`${baseUrl}/Following`} render={(props) => <Following {...props} userid={userid} />} />
                                    <Route path={`${baseUrl}/Activity`} render={(props) => <Activity {...props} userid={userid} metadata={metadata} />} />
                                </Col>

                            </Row>
                        </Col>
                        <Col id="smallCol"></Col>
                        <Col sm={2}>
                            <Row id="headingRow"><h3 className="heading3">Credential & highlights</h3></Row>
                            <Row id="menuRow">
                                {this.state.isCurrUser ?
                                    <span>
                                        {this.state.career.length === 0 ?
                                            <a href="#" onClick={this.toggleEmpCredEditor}
                                                title="Edit Employment credential"><h3 className="heading3">
                                                    <i className="fas fa-briefcase fa-1x navlinkText"></i> Add employment credential</h3></a>
                                            :
                                            <div id="credInfo"> <i className="fas fa-briefcase fa-1x navlinkText"></i>&nbsp;
                                    {this.state.career[0].position}&nbsp;at {this.state.career[0].company} &nbsp;
                                    <a href="#" id="editPencil" onClick={this.toggleEmpCredEditor}><i className="fa fa-pencil fa-1x navlinkText"></i></a>
                                                <br />
                                                <span id="ligtenColor" >({this.state.career[0].start_year}-{this.state.career[0].end_year})</span>
                                            </div>
                                        }
                                    </span> :
                                    <span>
                                        {this.state.career.length === 0 ?
                                            <h3 className="heading3">{this.state.firstname} has no employment credential yet</h3>
                                            :
                                            <div id="credInfo"> <i className="fas fa-briefcase fa-1x navlinkText"></i>&nbsp;
                                {this.state.career[0].position}&nbsp;at {this.state.career[0].company} &nbsp;
                                <br />
                                                <span id="ligtenColor" >({this.state.career[0].start_year}-{this.state.career[0].end_year})</span>
                                            </div>
                                        }
                                    </span>}
                            </Row>

                            <Row id="menuRow1">
                                {this.state.isCurrUser ?
                                    <span>
                                        {this.state.education.length === 0 ? <a href="#" onClick={this.toggleEduCredEditor}>
                                            <h3 className="heading3"> <i className="fas fa-graduation-cap fa-1x navlinkText"></i> Add education credential</h3></a>
                                            : <div id="credInfo"> <i className="fas fa-graduation-cap fa-1x navlinkText"></i>
                                                {this.state.education[0].degree}&nbsp;{this.state.education[0].concentration},&nbsp;
                                {this.state.education[0].school} &nbsp;<a href="#" id="editPencil" onClick={this.toggleEduCredEditor}>
                                                    <i className="fa fa-pencil fa-1x navlinkText"></i>
                                                </a>
                                                <br />
                                                <span id="ligtenColor">
                                                    Graduation Year, {this.state.education[0].graduation_year}</span>
                                            </div>}
                                    </span> :
                                    <span>
                                        {this.state.education.length === 0 ?
                                            <h3 className="heading3">{this.state.firstname} has no education credential yet</h3>
                                            : <div id="credInfo"> <i className="fas fa-graduation-cap fa-1x navlinkText"></i>
                                                {this.state.education[0].degree}&nbsp;{this.state.education[0].concentration},&nbsp;
                                    {this.state.education[0].school} &nbsp;<a href="#" id="editPencil" onClick={this.toggleEduCredEditor}>
                                                    <i className="fa fa-pencil fa-1x navlinkText"></i>
                                                </a>
                                                <br />
                                                <span id="ligtenColor">
                                                    Graduation Year, {this.state.education[0].graduation_year}</span>
                                            </div>}
                                    </span>}
                            </Row>

                            <Row id="menuRow1">
                                {this.state.isCurrUser ?
                                    <span>
                                        {(this.state.state === '' && this.state.city === '' && this.state.zipcode === '') || (!this.state.state && !this.state.city && !this.state.zipcode)
                                            ? <a href="#" onClick={this.toggleLocCredEditor}>
                                                <h3 className="heading3"><i className="fas fa-location-arrow fa-1x navlinkText"></i> Add a location credential</h3></a>
                                            :
                                            < div id="credInfo">
                                                <i className="fas fa-location-arrow fa-1x navlinkText"></i> {location}
                                                &nbsp;<a href="#" id="editPencil" onClick={this.toggleLocCredEditor}>
                                                    <i className="fa fa-pencil fa-1x navlinkText"></i>
                                                </a>
                                            </div>}
                                    </span> :
                                    <span>
                                        {(this.state.state === '' && this.state.city === '' && this.state.zipcode === '') || (!this.state.state && !this.state.city && !this.state.zipcode) ?
                                            <h3 className="heading3">{this.state.firstname} has no location credential yet</h3>
                                            :
                                            < div id="credInfo">
                                                <i className="fas fa-location-arrow fa-1x navlinkText"></i> {location}
                                            </div>}
                                    </span>}
                            </Row>
                            <br />
                            <Row id="headingRow">
                                <Col className="sm10Col" sm={10}><h3 className="heading3">Knows about</h3></Col>
                                {this.state.isCurrUser ?
                                    <Col sm={2}><a href="#" id="editPencil" onClick={this.toggleTopicEditor} title="Edit knows about">
                                        <i className="fa fa-pencil fa-1x navlinkText"></i>
                                    </a></Col>
                                    : null}
                            </Row>
                            <br />
                            <Row >
                                {this.state.isCurrUser ?
                                    details : null}
                            </Row>

                        </Col>
                    </Row>
                </Container>
                {/* Modal for ProfileCredentials*/}
                <Modal size="lg" show={this.state.showCredEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Credentials
                                    <br />
                            <h3>Credentials also appear on answers you write.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveCredential}>
                            <Form.Row>
                                <Col sm="12">
                                    <Form.Label> <i className="far fa-user fa-1x navlinkText"></i> Add profile credential  </Form.Label>
                                    <Input type="textfield" name='Cred' defaultValue={this.state.credentials}
                                        placeholder='Artist and published novelist living in california' onChange={this.credHandler}
                                        required />
                                </Col>
                            </Form.Row>
                            <br />
                            <Form.Row>
                                <Col sm="9"></Col>
                                <Col sm="3">
                                    <Button type="close" variant="secondary" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                <Button type="submit" onClick={this.handleClose}>Save</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal for Image*/}
                <Modal size="md" show={this.state.showImageEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Image
                                    <br />
                            <h3 className="heading3">Image appear on your profile.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveImage}>
                            <Form.Row>
                                <Col sm="12">
                                    {/* <Form.Label> <i className="far fa-user fa-1x navlinkText"></i> Select your profile picture </Form.Label> */}
                                    Select image: <Input type="file" onChange={this.handleFile} accept="image/*" required />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col sm="9"></Col>
                                <Col sm="3">
                                    {/* <Button type="close" variant="secondary" onClick={this.handleClose}>Cancel</Button> &nbsp; */}
                                    <Button type="submit" onClick={this.handleClose}>Upload</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal for description*/}
                <Modal size="lg" show={this.state.showInlineEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit description
                                    <br />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.updateDescription}>
                            <Form.Row>
                                <Col sm="12">
                                    <Form.Label> <i className="far fa-user fa-1x navlinkText"></i> Add Description  </Form.Label>
                                    <Input type="textfield" name='desc' defaultValue={this.state.description} onChange={this.descHandler}
                                        required />
                                </Col>
                            </Form.Row>
                            <br />
                            <Form.Row>
                                <Col sm="9"></Col>
                                <Col sm="3">
                                    <Button type="close" variant="secondary" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                    <Button type="submit" onClick={this.handleClose}>Save</Button>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal for Employment Credentials      */}
                <Modal size="lg" show={this.state.showEmpCredEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Credentials
                                    <br />
                            <h3 className="heading3">Credentials also appear on answers you write.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveEmpCredential}>
                            <Form.Row>
                                <Col sm="12">

                                    <Form.Label> <i className="fas fa-briefcase fa-1x navlinkText"></i>  Add employment credential  </Form.Label>
                                    <Row>
                                        <Col sm="4">Position</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue=''
                                            placeholder='Software Enginner' onChange={this.positionHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4"> Company/Organization</Col>
                                        <Col sm="8"><Input type="textfield" name='company' defaultValue=''
                                            placeholder='Apple Inc.' onChange={this.companyHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Start Year </Col>
                                        <Col sm="8"><select value={this.state.start_year} onChange={this.onHandleStartDateChange}>
                                            {options}
                                        </select></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4"> End Year </Col>
                                        <Col sm="8"><select value={this.state.end_year} onChange={this.onHandleEndDateChange}>
                                            {options}
                                        </select></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">  </Col>
                                        <Col sm="8"><Form.Group controlId="formBasicChecbox">
                                            <Form.Check type="checkbox" label="Set as current" onChange={this.handleCurrentChange} />
                                        </Form.Group></Col>
                                    </Row>
                                    <Row>
                                        <Col sm="9"></Col>
                                        <Col sm="3">
                                            <Button type="close" variant="secondary" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                <Button type="submit" variant="info" size="sm" onClick={this.handleClose}>Save</Button>
                                        </Col>
                                    </Row>
                                </Col>

                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            {careerDetails}
                        </div>
                    </Modal.Footer>
                </Modal>
                {/* Modal for Update Employment Credentials      */}
                <Modal size="lg" show={this.state.showUpdateEmpCredEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Credentials
                                    <br />
                            <h3 className="heading3">Credentials also appear on answers you write.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveUpdateEmpCredential}>
                            <Form.Row>
                                <Col sm="12">

                                    <Form.Label> <i className="fas fa-briefcase fa-1x navlinkText"></i>  Add employment credential  </Form.Label>
                                    <Row>
                                        <Col sm="4">Position</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue={this.state.position}
                                            placeholder='Software Enginner' onChange={this.positionHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4"> Company/Organization</Col>
                                        <Col sm="8"><Input type="textfield" name='company' defaultValue={this.state.company}
                                            placeholder='Apple Inc.' onChange={this.companyHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Start Year </Col>
                                        <Col sm="8"><select defaultValue={this.state.start_year} onChange={this.onHandleStartDateChange}>
                                            {options}
                                        </select></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4"> End Year </Col>
                                        <Col sm="8"><select defaultValue={this.state.end_year} onChange={this.onHandleEndDateChange}>
                                            {options}
                                        </select></Col>
                                    </Row>
                                    <Row>
                                        <Col sm="4">  </Col>
                                        <Col sm="8"><Form.Group controlId="formBasicChecbox">
                                            <Form.Check type="checkbox" label="Set as current" checked={this.state.isCurrent} onChange={this.handleCurrentChange} />
                                        </Form.Group></Col>
                                    </Row>
                                    <Row>
                                        <Col sm="9"></Col>
                                        <Col sm="3">
                                            <Button type="close" variant="secondary" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                <Button type="submit" variant="info" size="sm" onClick={this.handleClose}>Save</Button>
                                        </Col>
                                    </Row>
                                </Col>

                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            {careerDetails}
                        </div>
                    </Modal.Footer>
                </Modal>
                {/* Modal for Education Credentials      */}
                <Modal size="lg" show={this.state.showEduCredEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Credentials
                                    <br />
                            <h3 className="heading3">Credentials also appear on answers you write.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveEduCredential}>
                            <Form.Row>
                                <Col sm="12">
                                    <Form.Label> <i className="fas fa-graduation-cap fa-1x navlinkText"></i> Add education credential</Form.Label>
                                    <Row>
                                        <Col sm="4">School</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue=''
                                            placeholder='Vassar College' onChange={this.schoolHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Concentration</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue=''
                                            placeholder='Philosophy' onChange={this.concentHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Degree Type</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue=''
                                            placeholder='Ph.D' onChange={this.degreeHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Graduation Year </Col>
                                        <Col sm="8"><select value={this.state.selectedGradYear} onChange={this.onHandleGradYear}>
                                            {options}
                                        </select></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="9"></Col>
                                        <Col sm="3">
                                            <Button type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                <Button type="submit" variant="info" size="sm" onClick={this.handleClose}>Save</Button>
                                        </Col>
                                    </Row>
                                </Col>

                            </Form.Row>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            {educationDetails}
                        </div>
                    </Modal.Footer>


                </Modal>
                {/* Modal for Update Education Credentials      */}
                <Modal size="lg" show={this.state.showUpdateEduCredEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Credentials
                                    <br />
                            <h3 className="heading3">Credentials also appear on answers you write.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveUpdateEduCredential}>
                            <Form.Row>
                                <Col sm="12">
                                    <Form.Label> <i className="fas fa-graduation-cap fa-1x navlinkText"></i> Edit credential</Form.Label>
                                    <Row>
                                        <Col sm="4">School</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue={this.state.school}
                                            placeholder='Vassar College' onChange={this.schoolHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Concentration</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue={this.state.concentration}
                                            placeholder='Philosophy' onChange={this.concentHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Degree Type</Col>
                                        <Col sm="8"><Input type="textfield" name='position' defaultValue={this.state.degree}
                                            placeholder='Ph.D' onChange={this.degreeHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Graduation Year </Col>
                                        <Col sm="8"><select value={this.state.selectedGradYear} onChange={this.onHandleGradYear}>
                                            {options}
                                        </select></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="9"></Col>
                                        <Col sm="3">
                                            <Button type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                <Button type="submit" variant="info" size="sm" onClick={this.handleClose}>Save</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal for location Credentials      */}
                <Modal size="lg" show={this.state.showLocCredEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Credentials
                                    <br />
                            <h3 className="heading3">Credentials also appear on answers you write.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveLocCredential}>
                            <Form.Row>
                                <Col sm="12">
                                    <Form.Label> <i className="fa fa-map-marker fa-1x navlinkText"></i> Add a location credential</Form.Label>
                                    <Row>
                                        <Col sm="4">City</Col>
                                        <Col sm="8"><Input type="textfield" name='city' defaultValue={this.state.city}
                                            placeholder='London' onChange={this.cityHandler}
                                            required /></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">State</Col>
                                        <Col sm="8">
                                            <select className="form-control" id="state" value={this.state.state} onChange={this.stateHandler}>
                                                {stateOptions}
                                            </select>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="4">Zipcode </Col>
                                        <Col sm="8">
                                            <Input type="textfield" name='zipcode' defaultValue={this.state.zipcode}
                                                placeholder='xxxxx or xxxxx-xxxx' pattern='^\d{5}$|^\d{5}-\d{4}$' maxLength="10"
                                                onChange={this.zipcodeHandler}
                                                required />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col sm="9"></Col>
                                        <Col sm="3">
                                            <Button type="close" variant="light" size="sm" onClick={this.handleClose}>Cancel</Button> &nbsp;
                                                <Button type="submit" variant="info" size="sm">Save</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal for topic       */}
                <Modal size="lg" show={this.state.showTopicEditor} onHide={this.handleClose}
                    aria-labelledby="example-modal-sizes-title-lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit the topics you know about
                                    <br />
                            <h3 className="heading3">Topics are used to find the best experts to answer the question.</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.saveTopic}>
                            <Form.Row>
                                <Col sm="12">
                                    <Select
                                        defaultValue={selectedOption}
                                        onChange={this.handleTopicChange}
                                        options={topicsoptions}
                                        isMulti
                                    />
                                    <br />
                                    <Row>
                                        <Col sm={5}></Col>
                                        <Col sm={2}><Button variant="info" type="submit" size="sm">Save</Button></Col>
                                        <Col sm={5}></Col>
                                    </Row>
                                </Col>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                </Modal>

            </div >

        )
    }
}

export default User;
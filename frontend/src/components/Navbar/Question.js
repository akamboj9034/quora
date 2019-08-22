import React, { Component } from 'react';
import '../../index.css';
import ReactModal from 'react-modal';
import axios from 'axios';

const customStyles = {
    content: {
      top: '35%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '500px',
      width: '570px',
      borderRadius: '2%',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.377)'
    }
  };

export class Question extends Component {
    constructor() {
        super();    
        this.state = {
          question_owner : 'Dhruvil',  
          openQuestionModal: true,
          question : '',
          topics : [],
          topic : []
        };
           
        this.closeModal = this.closeModal.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);       
      
      }

      componentDidMount(){
        // get topics from db asign it to this.state.topics
        let response = [
          { id: 1, name: "Technology", image: "https://png.pngtree.com/element_origin_min_pic/16/12/16/0958534a4d654dd.jpg"},
          { id: 2, name: "Science", image: "https://img.freepik.com/free-vector/science-icon-collection_23-2147504869.jpg?size=338&ext=jpg"},
          { id: 3, name: "Movies", image: "https://images.cdn4.stockunlimited.net/clipart/film-camera-icon_2022806.jpg"},
          { id: 4, name: "Sports", image: "http://www.paredro.com/wp-content/uploads/2016/04/1-Sport-Icons.jpg"},
          { id: 5, name: "Business", image: "https://bettermoneyhabits.bankofamerica.com/content/dam/bmh/khan-thumbnails/Tips-to-save-money-250px-01.jpg.thumb.1280.1280.jpg"},
          { id: 6, name: "History", image: "https://st3.depositphotos.com/3268541/12707/v/950/depositphotos_127072292-stock-illustration-history-vector-symbol.jpg"},
          { id: 7, name: "Cooking", image: "https://img.freepik.com/free-vector/cooking-utensils-set-vector-illustration_53876-43767.jpg?size=338&ext=jpg"},
          { id: 8, name: "Photography", image: "https://i.pinimg.com/originals/aa/f7/26/aaf72696855548fce7180ec85273988a.jpg"},
          { id: 9, name: "Education", image: "http://www.soidergi.com/wp-content/uploads/mi/thumb-minimal-logo-graduation-cap-white-background-vector-illustration-design-minimal-logo-graduation-cap-vector-illustration-image.jpg"},
          { id: 10, name: "Politics", image: "https://t3.ftcdn.net/jpg/01/96/92/26/500_F_196922693_YHc0Ws3vgRF01nyzQXsYOttriLH7AnbY.jpg"},
          { id: 11, name: "Literature", image: "https://irp-cdn.multiscreensite.com/5ea5d4db/dms3rep/multi/mobile/diversity-knowledge-book-tree-132983-diversity-knowledge-book-tree-jpg-e1Wwmf-clipart-1600x1591.jpg"}
        ]
        // axios.get("/topic", (err, response) => {
        //   if(err) alert("Something went wrong.")
        //   else{
        //     console.log(response.data);
        //   }
        // })
        this.setState({
          topics: response
        })
      }
      
      closeModal() {
        this.setState({ openQuestionModal: false });
      }
      handleInputChange = (e) => {
        let arr = this.state.topic
        let val = e.target.name
        arr.push(val)
        console.log(arr);
        this.setState({ topic : arr})
        ;
      }
          
      cancelHandler = (e) => {
        this.props.history.push("/home");
    }
    submitHandler = (e) => {
        e.preventDefault();
        const data = {
          question_owner: this.state.question_owner,
          question : this.state.question,    
          topic : this.state.topic  
        }
        
        console.log("Data in frontend send from question modal to server is" ,data);
        axios.post("http://localhost:3001/question", data)
            .then(response => {
                if(response.data.message==="success"){
                    this.props.history.push("/home");
                }
                else{
                    alert("Unable to add Question!!");
                    this.props.history.push("/");
                }
            });
    }

    render() {
      return (
        <ReactModal
        isOpen={this.state.openQuestionModal}
        contentLabel="Question Modal"
        style={customStyles}
      >
       
          <div className="Question">
            <h4>{this.state.question_owner} asked</h4>
            {(this.state.topics).map((resp,index)=>{
                 return <div class="checkbox">  
                      
                      <input
                        name={resp.name}
                        type="checkbox"
                        checked={this.state.isChecked}
                        onChange={this.handleInputChange} />
                   <label>{resp.name} </label>
                    <br />
               </div>                  
            
             })}
          </div>
          <form className="signupform" onSubmit={this.submitHandler}>
              <input type="text" placeholder="Start your question with 'What','How','Why',etc.  " onChange={(e)=>{this.setState({question:e.target.value})}}  required /><br />
              <input type="submit" name="Add" value="Add Question" style={{width:"150px"}} className="btn btn-primary" />
              <button className="btn btn-secondary" onClick={this.cancelHandler}>Cancel</button> 
            </form>
      </ReactModal>   
      )
    }
  }
  
  export default Question
  
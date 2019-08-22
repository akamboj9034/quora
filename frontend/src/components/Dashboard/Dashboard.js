import React, { Component } from 'react';
import topic_img from "../../public/user.png"
import { Bookmarks } from '../Stats/Bookmarks';

export class Dashboard extends Component {
    render() {
      return (
          <div>
      <div className="container top_100">
         <div className="row">
            <div className="col-md-3">
                <div className="sidenav">
                        <a href="/topic/"><img src={topic_img} height="20px" width="20px"/> Topic 1</a>
                        <a href="/topic/"><img src={topic_img} height="20px" width="20px"/> Topic 2</a>
                        <a href="/topic/"><img src={topic_img} height="20px" width="20px"/> Topic 3</a>
                        <a href="/topic/"><img src={topic_img} height="20px" width="20px"/> Topic 4</a>
                        <a href="/topic/"><img src={topic_img} height="20px" width="20px"/> Topic 5</a>           
                        <a href="/bookmarks"><i className="fas fa-bookmark"></i> Bookmarks</a>           
                </div>
            </div>
            <div className="col-md-6">
                <div className="questionBox">
                    <div className="question">
                         <h4>Why is Canon better than Nikon?</h4>    
                    </div>
                    <div className="responderBox">
                        <div className="row">
                                <div className="col-md-1">
                                    <img src={topic_img} height="40px" width="40px"/>
                                </div>
                                <div className="col-md-11">
                                    <p>Amit Kamboj, Professional Photographer</p>
                                    <span className="answeredDate">Answered Jul 24, 2018</span>
                                </div>
                        </div>
                    </div>
                    <div className="answerBox">
                        <p>That depends on what type of loan you’re seeking. The SBA Express loan has earned its name because it requires minimal paperwork and 
                            can fund incredibly fast. It's basically an SBA 7(a) loan that's been fine-tuned for speed and efficiency.
                            <br/>
                            <br/>
                            <p>If you’re an exporter by trade, you may qualify for the second type, aptly named an Export Express Loan. This loan is similar to a traditional SBA Express Loan, 
                                with two notable differences being that approval time is even faster and the maximum amount is elevated to $500,000.</p>
                            </p>
                    </div>
                </div>
                <div className="questionBox">
                    <div className="question">
                         <h4>Why is Canon better than Nikon?</h4>
                    </div>
                    <div className="responderBox">
                        <div className="row">
                                <div className="col-md-1">
                                    <img src={topic_img} height="40px" width="40px"/>
                                </div>
                                <div className="col-md-11">
                                    <p>Amit Kamboj, Professional Photographer</p>
                                    <span className="answeredDate">Answered Jul 24, 2018</span>
                                </div>
                        </div>


                    </div>
                    <div className="answerBox">
                        <p>That depends on what type of loan you’re seeking. The SBA Express loan has earned its name because it requires minimal paperwork and 
                            can fund incredibly fast. It's basically an SBA 7(a) loan that's been fine-tuned for speed and efficiency.
                            <br/>
                            <br/>
                            <p>If you’re an exporter by trade, you may qualify for the second type, aptly named an Export Express Loan. This loan is similar to a traditional SBA Express Loan, 
                                with two notable differences being that approval time is even faster and the maximum amount is elevated to $500,000.</p>

                            </p>
                    </div>

                </div>


                <div className="questionBox">
                    <div className="question">
                         <h4>Why is Canon better than Nikon?</h4>
       
                    </div>
                    <div className="responderBox">
                        <div className="row">
                                <div className="col-md-1">
                                    <img src={topic_img} height="40px" width="40px"/>
                                </div>
                                <div className="col-md-11">
                                    <p>Amit Kamboj, Professional Photographer</p>
                                    <span className="answeredDate">Answered Jul 24, 2018</span>
                                </div>
                        </div>


                    </div>
                    <div className="answerBox">
                        <p>That depends on what type of loan you’re seeking. The SBA Express loan has earned its name because it requires minimal paperwork and 
                            can fund incredibly fast. It's basically an SBA 7(a) loan that's been fine-tuned for speed and efficiency.
                            <br/>
                            <br/>
                            <p>If you’re an exporter by trade, you may qualify for the second type, aptly named an Export Express Loan. This loan is similar to a traditional SBA Express Loan, 
                                with two notable differences being that approval time is even faster and the maximum amount is elevated to $500,000.</p>

                            </p>
                    </div>

                </div>


            </div>
            <div className="col-md-3">
            </div>

        </div>





      </div>





</div>
      )
    }
  }
  
  export default Dashboard
  
import React, { Component } from 'react';
import '../../index.css';
import topic_img from "../../public/user.png"


export class Comment extends Component {

    render() {
        return (
            <div className="commentbox">
                <div className="row">
                    <div className="col-md-1">
                        <img src={topic_img} height="30px" width="30px" />
                    </div>
                    <div className="col-md-7">
                        <input type="text" id="ip2" />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-success">Add comment</button>
                    </div>
                </div>
            </div>

        )
    }
}

export default Comment
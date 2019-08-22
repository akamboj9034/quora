import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ProfileViews from './ProfileViews';
import AnswerViews from './AnswerViews';
import Upvotes from './Upvotes';
import Downvotes from './Downvotes';
import Bookmarks from './Bookmarks';
import axios from 'axios';
import { rootUrl } from '../../config/settings';
import Cookies from 'js-cookie';

export class Stats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "profileview",
            profileviews: null,
            pviews: 0
        }
    }

    componentDidMount() {
        axios.get(rootUrl + "/user/" + Cookies.get('_id') + "/profile_stats")
            .then((result) => {
                // this.setState({
                //     pviews: result.data.data.view.length
                // })
                const profileviews = [
                    { day: 30, views: 0 },
                    { day: 29, views: 0 },
                    { day: 28, views: 0 },
                    { day: 27, views: 0 },
                    { day: 26, views: 0 },
                    { day: 25, views: 0 },
                    { day: 24, views: 0 },
                    { day: 23, views: 0 },
                    { day: 22, views: 0 },
                    { day: 21, views: 0 },
                    { day: 20, views: 0 },
                    { day: 19, views: 0 },
                    { day: 18, views: 0 },
                    { day: 17, views: 0 },
                    { day: 16, views: 0 },
                    { day: 15, views: 0 },
                    { day: 14, views: 0 },
                    { day: 13, views: 0 },
                    { day: 12, views: 0 },
                    { day: 11, views: 0 },
                    { day: 10, views: 0 },
                    { day: 9, views: 0 },
                    { day: 8, views: 0 },
                    { day: 7, views: 0 },
                    { day: 6, views: 0 },
                    { day: 5, views: 0 },
                    { day: 4, views: 0 },
                    { day: 3, views: 0 },
                    { day: 2, views: 0 },
                    { day: 1, views: result.data.data.view.length }
                ]
            profileviews.map((d) => { return d.name = d.day + " day ago" })
            this.setState({ profileviews });
            })
           
        //axios.get here

    }

    render() {
        return (
            <div className="stats">
                <h4>Stats</h4><br />
                <Tabs
                    id="controlled-tab-example"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}
                >
                    <Tab eventKey="profileview" title="Profile Views">
                        <ProfileViews data={this.state.profileviews} />
                    </Tab>
                    <Tab eventKey="answerview" title="Answer Views">
                        <AnswerViews />
                    </Tab>
                    <Tab eventKey="upvotes" title="Upvotes">
                        <Upvotes />
                    </Tab>
                    <Tab eventKey="downvotes" title="Downvotes">
                        <Downvotes />
                    </Tab>
                    <Tab eventKey="bookmarks" title="Bookmarks">
                        <Bookmarks />
                    </Tab>
                </Tabs>
            </div>
        )
    }
}

export default Stats

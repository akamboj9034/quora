import React, { Component } from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { rootUrl } from '../../config/settings';
import Cookies from 'js-cookie';

export class AnswerViews extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    axios.get(rootUrl + "/user/" + Cookies.get('_id') + "/answer_stats")
      .then((result) => {
        console.log(result.data.data)
        let data = result.data.data
        data.map((d) => { return d.name = d.answer.slice(0, 10) + "..." })
        this.setState({ data });
      })
  }

  render() {
    return (
      <div className="answerviews">
        <Row>
          <Col sm={6} >
            {(this.state.data).map((data, index) => {
              return <p key={index} className="answerviewlist">
                <div className="userDesc" dangerouslySetInnerHTML={{ __html: data.answer }} />
                {/* {data.answer.slice(0,70)}
              {(data.answer.length>70)?"...":null} */}
              </p>
            })}
          </Col>
          <Col sm={6} >
            <PieChart width={400} height={400} >
              <Pie dataKey="view" isAnimationActive={true} data={this.state.data} cx={200} cy={200} innerRadius={40} outerRadius={80} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AnswerViews

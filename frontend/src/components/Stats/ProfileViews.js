import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export class ProfileViews extends Component {

  render() {

    const data = this.props.data;

    return (
      <div className="profileview">Views
        <LineChart width={1100} height={300} data={data} >
          <Line type="monotone" dataKey="views" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="day"  />
          <YAxis dataKey="views"  />
          <Tooltip />
        </LineChart>
        <span style={{float:"right"}}>Last 30 Days</span>
      </div>
    )
  }
}

export default ProfileViews

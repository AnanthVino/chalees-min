import React from 'react';
import * as auth from './auth.js';
import Header from './header.js';
import ImageResponse from './image-response.js';
import TextResponse from './text-response.js';
import VideoInstruction from './video-instruction.js';
import HtmlWidget from './html-widget.js';
import * as data from './data.js';

// Authorize them to all services if they're signed in

const Application = React.createClass({
  componentDidMount: async function () {
    try {
      await auth.authorize();      
      this.setState({isLoggedIn: true});
      data.onUpdate((data) => {
        console.log('updated data');
        this.setState({data: data || {}});
        console.log('test');
      });
    } catch (error) {
      this.setState({isLoggedIn: false})
    }
  },

  getInitialState: function () {
    return {
      data: {}
    };
  },
  render: function () {
    return (
      <div className="pie">
        <Header lock={this.lock} authProfile={this.state.authProfile} loggedIn={this.state.isLoggedIn} />
        {React.cloneElement(this.props.children, { loggedIn: this.state.isLoggedIn, data: this.state.data })}
      </div>
    );
  }
});

export default Application;
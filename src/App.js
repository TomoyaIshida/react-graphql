import React, { Component } from 'react';
import './App.css';

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

class App extends Component {
  render() {
    return (
      <div>
        Hello React!
      </div>
    );
  }
}

export default App;

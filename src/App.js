import React, {Component} from 'react';
import logo from './syncpad-icon.svg';
import './App.css';

class App extends Component {
    render()
    {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to SyncPad</h2>
                </div>
                <p className="App-intro">
                    To get started, choose an existing session from the list or create a new one below.
                </p>
            </div>
        );
    }
}

export default App;
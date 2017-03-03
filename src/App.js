import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';
import Loader from './Loader.js';
import './style/App.css';

class App extends Component {

    render()
    {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to SyncPad</h2>
                </div>
                <div className="App-body">
                    <div>
                        <p className="App-intro">
                            To get started, choose an existing session from the list or create a new one below.
                        </p>
                        <hr className="App-separator"/>
                    </div>
                    <div className="App-body-buttons">
                        <button className="App-button App-button-update">Refresh</button>
                        <button className="App-button App-button-add">Create session</button>
                    </div>
                    {!this.props.data && <Loader/>}
                </div>
            </div>
        );
    }
}

export default App;
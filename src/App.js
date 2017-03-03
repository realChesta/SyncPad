import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';

import './style/App.css';

import Loader from './Loader.js';
import SessionDisplayer from './SessionDisplayer.js';

class App extends Component {

    render()
    {
        if (this.props.tableData)
        {
            var comp = <SessionDisplayer data={this.props.tableData}/>;
        }
        else
        {
            var comp = <Loader/>;
        }

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
                        <button className="g-button App-button-update">Refresh</button>
                        <button className="g-button App-button-add">Create session</button>
                    </div>
                    {comp}
                </div>
            </div>
        );
    }
}

export default App;
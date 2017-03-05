import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';

import './style/App.css';

import Loader from './Loader.js';
import SessionDisplayer from './SessionDisplayer.js';
import Transition from './Transition.js';

class App extends Component {

    render()
    {
        if (this.props.tableData)
        {
            var comp =
                <SessionDisplayer
                    key="sd"
                    data={this.props.tableData}
                    connectHandler={this.props.connectHandler}
                />;
        }
        else
        {
            var comp = <Loader key="loader"/>;
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
                        <button className="g-button App-button-update" onClick={this.props.refreshHandler}>Refresh
                        </button>
                        <button className="g-button App-button-add" onClick={this.props.createHandler}>Create session
                        </button>
                    </div>
                    <Transition>
                        {comp}
                    </Transition>
                </div>
            </div>
        );
    }
}

export default App;
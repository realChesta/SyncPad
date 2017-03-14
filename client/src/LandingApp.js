import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';

import './style/LandingApp.css';

import Loader from './Loader.js';
import SessionDisplayer from './SessionDisplayer.js';
import FadeTransition from './FadeTransition.js';
import InputBox from './InputBox.js';
import ErrorBox from './ErrorBox.js';

class LandingApp extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            input: false
        };
    }

    handleCreate = (e) =>
    {
        this.setState({ input: true });
    };

    handleDone = (sname) =>
    {
        this.setState({ input: false });
        if (sname)
        {

            console.log("session name: " + sname);
            this.props.createHandler(sname);
        }
    };

    render()
    {
        let comp;

        if (this.state.input)
        {
            comp =
                <InputBox
                    key="inputBox"
                    title="Create session"
                    text="Enter your desired session name below:"
                    action="Confirm"
                    onDone={this.handleDone}
                />;
        }
        else if (this.props.error)
        {
            comp =
                <ErrorBox
                    key="errBox"
                    title={this.props.error.title}
                    message={this.props.error.message}
                />;
        }
        else if (this.props.tableData)
        {
            comp =
                <SessionDisplayer
                    key="sessDisplayer"
                    data={this.props.tableData}
                    connectHandler={this.props.connectHandler}
                />;
        }
        else
        {
            comp = <Loader key="loader"/>;
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
                        <button
                            disabled={this.state.input}
                            className="g-button App-button-update"
                            onClick={this.props.refreshHandler}>
                            Refresh
                        </button>
                        <button
                            disabled={this.state.input}
                            className="g-button App-button-add"
                            onClick={this.handleCreate}>
                            Create session
                        </button>
                    </div>
                    <FadeTransition>
                        {comp}
                    </FadeTransition>
                </div>
            </div>
        );
    }
}

export default LandingApp;
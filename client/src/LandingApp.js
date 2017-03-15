import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';

import './style/LandingApp.css';

import Loader from './Loader.js';
import SessionDisplayer from './SessionDisplayer.js';
import FadeTransition from './FadeTransition.js';
import InputBox from './InputBox.js';
import ErrorBox from './ErrorBox.js';
import CreateSessionBox from './CreateSessionBox.js';

class LandingApp extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            input: false,
            create: false
        };
    }

    handleJoin = (sname) =>
    {
        this.setState({input: true, sname: sname});
    };

    handleDone = (user) =>
    {
        this.setState({input: false});
        if (user)
        {
            console.log("session name: " + user);
            this.props.joinHandler(user, this.state.sname);
        }
    };

    handleCreate = (e) =>
    {
        this.setState({create: true});
    };

    handleCreateDone = (user, session) =>
    {
        this.setState({create: false});

        if (user && session)
        {
            this.props.joinHandler(user, session)
        }
    };

    render()
    {
        let comp;

        if (this.state.create)
        {
            comp =
                <CreateSessionBox
                    key="createBox"
                    title="Create Session"
                    userText="Choose a username under which you will appear for others:"
                    sessionText="Enter a session name:"
                    action="Create"
                    onDone={this.handleCreateDone}
                />
        }
        else if (this.state.input)
        {
            comp =
                <InputBox
                    key="inputBox"
                    title="Join session"
                    text={"Choose a username under which you will appear for others in " + this.state.sname + ":"}
                    action="Join"
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
                    connectHandler={this.handleJoin}
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
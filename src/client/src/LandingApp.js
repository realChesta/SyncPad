import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';

import './style/LandingApp.css';

import Loader from './Loader.js';
import SessionDisplayer from './SessionDisplayer.js';
import FadeTransition from './FadeTransition.js';
import InputBox from './InputBox.js';
import ErrorBox from './ErrorBox.js';
import CreateSessionBox from './CreateSessionBox.js';
import Cookies from 'react-cookie';

class LandingApp extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            input: false,
            create: false
        };
    }

    componentDidMount()
    {
        document.title = "SyncPad";
    }

    handleJoin = (sname, smode) =>
    {
        this.setState({ input: true, sname: sname, smode: smode });
    };

    handleDone = (user) =>
    {
        this.setState({ input: false });
        if (user)
        {
            let d = new Date();
            let days = 7;
            d.setDate(d.getDate() + days);
            Cookies.save('lastUser', user, { path: '/', expires: d });

            this.props.joinHandler(user, this.state.sname, this.state.smode);
        }
    };

    handleCreate = (e) =>
    {
        this.setState({ create: true });
    };

    handleCreateDone = (user, session, mode) =>
    {
        this.setState({ create: false });

        if (user && session)
        {
            let d = new Date();
            let days = 7;
            d.setDate(d.getDate() + days);
            Cookies.save('lastUser', user, { path: '/', expires: d });

            this.props.joinHandler(user, session, mode)
        }
    };

    render()
    {
        let comp;

        if (this.state.create)
        {
            let preUser = Cookies.load('lastUser');

            comp =
                <CreateSessionBox
                    key="createBox"
                    title="Create Session"
                    userText="Choose a username under which you will appear for others:"
                    sessionText="Enter a session name:"
                    action="Create"
                    preUser={preUser}
                    onDone={this.handleCreateDone}
                />
        }
        else if (this.state.input)
        {
            let preUser = Cookies.load('lastUser');

            comp =
                <InputBox
                    key="inputBox"
                    title="Join session"
                    text={"Choose a username under which you will appear for others in " + this.state.sname + ":"}
                    action="Join"
                    preInput={preUser}
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
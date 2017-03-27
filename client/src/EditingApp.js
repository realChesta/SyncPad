/**
 * Created by Kyrill on 07.03.2017.
 */

import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';
import './style/EditingApp.css';
import SocketEditor from './SocketEditor.js';

class EditingApp extends Component {

    constructor(props)
    {
        super(props);

        this.state = {stateCode: 1, statusText: "connecting..."};
    }

    componentDidMount()
    {
        document.title = this.props.session + " - SyncPad";
    }

    returnError = (msg) =>
    {
        if (this.props.onError)
            this.props.onError(msg);
    };

    onSocketDisconnect = () =>
    {
        this.setState({stateCode: 2, statusText: "disconnected"});
        this.returnError("Connection to the session was interrupted!");
    };

    onSocketConnect = (data) =>
    {
        if (data.state)
        {
            this.setState({stateCode: 0, statusText: "connected"});
        }
        else
        {
            this.returnError(data.msg);
        }
    };

    onUserlist = (users) =>
    {
        console.log("userlist:" + JSON.stringify(users));
        this.setState({users: users});
    };

    render()
    {
        let orbclass;
        switch (this.state.stateCode)
        {
            case 0:
                orbclass = "EA-orb-ok";
                break;

            case 1:
                orbclass = "EA-orb-warning";
                break;

            case 2:
                orbclass = "EA-orb-error";
                break;
        }

        let items = [];

        for (let u in this.state.users)
        {
            if (u !== this.props.username)
            {
                items.push(
                    <div className="EA-body-sidebar-item" key={u}>
                        <div
                            className="EA-body-sidebar-item-colorstrip"
                            style={{backgroundColor: "rgba(" + this.state.users[u].r + ", " + this.state.users[u].g + ", " + this.state.users[u].b + ", 0.5)"}}
                        />
                        <p className="EA-body-sidebar-item-text">{u}</p>
                    </div>);
            }
            // return <p className="EA-body-sidebar-item"
            //           style={{ borderLeft: "2px solid rgb(" + this.state.users[u].r + ", " + this.state.users[u].g + ", " + this.state.users[u].r + ")" }}>{u}</p>;
        }

        return (
            <div className="EA">
                <a className="EA-head" href="/">
                    <div className="EA-head-logo">
                        <img src={logo} className="EA-head-logo-image" alt="logo"/>
                        <p className="EA-head-logo-text">SyncPad</p>
                    </div>
                    <div className="EA-head-state">
                        <div className={"EA-orb " + orbclass}/>
                        <p className="EA-head-state-text">{this.state.statusText}</p>
                    </div>
                    <p className="EA-head-title">{this.props.session}</p>
                </a>
                <div className="EA-body">
                    <div className="EA-body-editor">
                        <SocketEditor
                            mode={this.props.mode}
                            session={this.props.session}
                            username={this.props.username}
                            onDisconnect={this.onSocketDisconnect}
                            onConnect={this.onSocketConnect}
                            onUserlist={this.onUserlist}
                        />
                    </div>
                    <div className="EA-body-sidebar">
                        <p className="EA-body-sidebar-you">{this.props.username}</p>
                        <hr className="EA-body-sidebar-separator"/>
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}

export default EditingApp;
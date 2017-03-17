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

        this.state = { stateCode: 1, statusText: "connecting..." };
    }

    componentDidMount()
    {
        document.title = this.props.session + " - SyncPad";
    }

    onSocketDisconnect = () =>
    {
        this.setState({ stateCode: 2, statusText: "disconnected" });
    };

    onSocketConnect = (users) =>
    {
        this.setState({ stateCode: 0, statusText: "connected", users: users });
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

        let items = this.state.users ? this.state.users.map(u =>
            {
                if (u != this.props.username)
                    return <p className="EA-sidebar-item">{u}</p>;
            }) : [];

        return (
            <div className="EA">
                <div className="EA-head">
                    <div className="EA-head-logo">
                        <img src={logo} className="EA-head-logo-image" alt="logo"/>
                        <p className="EA-head-logo-text">SyncPad</p>
                    </div>
                    <div className="EA-head-state">
                        <div className={"EA-orb " + orbclass}/>
                        <p className="EA-head-state-text">{this.state.statusText}</p>
                    </div>
                    <p className="EA-head-title">{this.props.session}</p>
                </div>
                <div className="EA-body">
                    <div className="EA-body-editor">
                        <SocketEditor
                            session={this.props.session}
                            username={this.props.username}
                            onDisconnect={this.onSocketDisconnect}
                            onConnect={this.onSocketConnect}
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
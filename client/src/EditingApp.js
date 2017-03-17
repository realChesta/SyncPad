/**
 * Created by Kyrill on 07.03.2017.
 */

import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';
import './style/EditingApp.css';
import SocketEditor from './SocketEditor.js';

//<textarea className="EA-body-editor-textbox" ref={(input) => { this.textBox = input; }}/>

class EditingApp extends Component {

    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
    }

    onSocketDisconnect = () =>
    {

    };

    render()
    {
        return (
            <div className="EA">
                <div className="EA-head">
                    <div className="EA-head-logo">
                        <img src={logo} className="EA-head-logo-image" alt="logo"/>
                        <p className="EA-head-logo-text">SyncPad</p>
                    </div>
                    <p className="EA-head-title">{this.props.session}</p>
                </div>
                <div className="EA-body">
                    <div className="EA-body-editor">
                        <SocketEditor
                            session={this.props.session}
                            username={this.props.username}
                            onDisconnect={this.onSocketDisconnect}
                        />
                    </div>
                    <div className="EA-body-sidebar">
                        <div className="EA-body-sidebar-you">
                            <div className="EA-body-sidebar-you-orb EA-body-sidebar-you-orb-ok"/>
                            <p className="EA-body-sidebar-you-text">You</p>
                        </div>
                        <hr className="EA-body-sidebar-separator"/>
                        <p className="EA-body-sidebar-list-item">User</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditingApp;
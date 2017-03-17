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
                    <SocketEditor
                        className="EA-body-editor"
                        session={this.props.session}
                        username={this.props.username}
                    />
                    <div className="EA-body-sidebar">
                        <p className="EA-body-sidebar-list-item">User</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditingApp;
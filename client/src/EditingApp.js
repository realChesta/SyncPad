/**
 * Created by Kyrill on 07.03.2017.
 */

import React, {Component} from 'react';
import logo from './img/syncpad-icon.svg';
import './style/EditingApp.css';

class EditingApp extends Component {
    constructor(props)
    {
        super(props);
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
                    <p className="EA-head-title">Title</p>
                    <div className="EA-head-end"/>
                </div>
                <div className="EA-body">
                    <div className="EA-body-editor">
                        <textarea className="EA-body-editor-textbox"/>
                    </div>
                    <div className="EA-body-sidebar">
                        <ul>
                            
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditingApp;
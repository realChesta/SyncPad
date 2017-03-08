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
            <div className="EditingApp">
                <div className="EditingApp-head">
                    <div className="EditingApp-head-logo">
                        <img src={logo} className="EditingApp-head-logo-image" alt="logo"/>
                        <p className="EditingApp-head-logo-text">SyncPad</p>
                    </div>
                    <p className="EditingApp-head-title">Title</p>
                    <div className="EditingApp-head-end"/>
                </div>
                <div>
                    <p style={{ textAlign: "center" }}>center</p>
                </div>
            </div>
        );
    }
}

export default EditingApp;
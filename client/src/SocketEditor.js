/**
 * Created by Kyrill on 15.03.2017.
 */

import React, {Component} from 'react';
import AceEditor from 'react-ace';

import './style/SocketEditor.css';

var io = require('socket.io-client');

class SocketEditor extends Component {
    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        this.socket = io.connect('http://172.20.10.6/');
        this.socket.on('connect', this.onConnect);
        this.socket.on('connect_failed', this.onDisconnect);
        this.socket.on('error', this.onDisconnect);
        this.socket.on('disconnect', this.onDisconnect);
    }

    onConnect = () =>
    {
        this.socket.emit('auth', {session: this.props.session, name: this.props.username});
        this.socket.on('authResponse', this.onAuthed);
        this.socket.on('userlist', this.onUserlist);
        this.socket.on('op', this.onOp);
    };

    onDisconnect = () =>
    {
        if (this.props.onDisconnect)
            this.props.onDisconect();
    };

    onAuthed = (msg) =>
    {
        console.log('auth resp: ' + JSON.stringify(msg));

        if (this.props.onConnect)
            this.props.onConnect(msg);
    };

    onUserlist = (msg) =>
    {
        if (this.props.onUserlist)
            this.props.onUserlist(msg);
    };

    onChange = (value) =>
    {
        this.socket.emit('op', {content: value});
    };

    onOp = (data) =>
    {

    };

    render()
    {
        return (
            <div className="SocketEditor">
                <AceEditor
                    name="ace-editor"
                    width="100%"
                    height="100%"
                    showPrintMargin={false}
                    focus={true}
                    className="SocketEditor-textbox"
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default SocketEditor;
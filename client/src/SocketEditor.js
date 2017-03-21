/**
 * Created by Kyrill on 15.03.2017.
 */

import React, {Component} from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';
const { Range } = ace.acequire('ace/range');


import './style/SocketEditor.css';

var io = require('socket.io-client');
var jsDiff = require('diff');

class SocketEditor extends Component {
    constructor(props)
    {
        super(props);
        this.oldText = '';
    }

    componentDidMount()
    {
        this.socket = io.connect('http://localhost/');
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
        if (this.editor.curOp && this.editor.curOp.command.name)
        {
            let diff = jsDiff.diffChars(this.oldText, this.editor.getValue());
            let pos = this.editor.getCursorPosition();

            if (diff)
            {
                for (let i = 0; i < diff.length; i++)
                {
                    let op = {position: pos};
                    if (diff[i].added)
                    {
                        op.type = 'add';
                        op.content = diff[i].value;
                    }
                    else
                    {
                        op.type = 'remove';
                        op.length = diff[i].count;
                    }

                    this.socket.emit('op', op);
                }
            }
            this.socket.emit('op', {type: 'set', content: value});
        }

        this.oldText = this.editor.getValue();
    };

    onLoad = (editor) =>
    {
        this.editor = editor;
        this.editor.focus();
    };

    onOp = (op) =>
    {
        let pos = this.editor.getCursorPosition();

        switch (op.type)
        {
            case 'set':
            {
                this.editor.setValue(op.content);
            }
                break;

            case 'insert':
            {
                this.editor.session.insert(op.position, op.text);
            }
                break;

            case 'remove':
            {
                let newPos = this.editor.session.indexToPosition(this.editor.session.positionToIndex(op.position) + op.length);
                let range = new Range(op.position.row, op.position.column, newPos.row, newPos.column);
                this.editor.session.remove(op.position, range);
            }
                break;
        }

        this.editor.selection.moveTo(pos.row, pos.column);
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
                    onLoad={this.onLoad}
                    onChange={this.onChange}
                />;
            </div>
        );
    }
}

export default SocketEditor;
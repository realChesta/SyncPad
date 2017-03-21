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
        this.state = { cursors: [] };
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
        this.socket.emit('auth', { session: this.props.session, name: this.props.username });
        this.socket.on('authResponse', (msg) => this.onAuthed(msg));
        this.socket.on('userlist', (msg) => this.onUserlist(msg));
        this.socket.on('op', (op) => this.onOp(op));
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
            let diff = jsDiff.diffChars(this.oldText, value);
            let pos = this.editor.getCursorPosition();

            if (diff)
            {
                for (let i = 0; i < diff.length; i++)
                {
                    let op = { position: pos };
                    if (diff[i].added)
                    {
                        op.type = 'add';
                        op.content = diff[i].value;
                    }
                    else if (diff[i].removed)
                    {
                        op.type = 'remove';
                        op.length = diff[i].count;
                    }

                    this.socket.emit('op', op);
                }
            }
        }

        this.oldText = value;
    };

    onLoad = (editor) =>
    {
        this.editor = editor;
        this.editor.focus();

        let cursor2 = { update: (html, markerLayer, session, config) => this.updateMarker(html, markerLayer, session, config, new Range(0, 2, 0, 3)) };
        let obj = this.editor.session.addDynamicMarker(cursor2, false);
    };

    onOp = (op) =>
    {
        let pos = this.editor.getCursorPosition();
        let selection = this.editor.getSelectionRange();

        switch (op.type)
        {
            case 'set':
            {
                this.editor.setValue(op.content);
            }
                break;

            case 'add':
            {
                this.editor.session.insert(op.position, op.content);
            }
                break;

            case 'remove':
            {
                let index = this.editor.session.doc.positionToIndex(op.position) + op.length;
                let newPos = this.editor.session.doc.indexToPosition(index);
                let range = new Range(op.position.row, op.position.column, newPos.row, newPos.column);
                this.editor.session.remove(range);
            }
                break;
        }

        this.editor.selection.setRange(selection);
        // this.editor.selection.moveTo(pos.row, pos.column);
    };

    updateMarker = (html, markerLayer, session, config, range) =>
    {
        if (range.isMultiLine())
        {
            let extraStyle = "position: absolute; background-color: rgba(255, 0, 0, 0.5) ";
            markerLayer.drawMultiLineMarker(html, range, '', config, extraStyle);
        }
        else
        {
            let extraStyle = "position: absolute; border-left : solid 2px rgba(255, 0, 0, 0.5); ";
            markerLayer.drawSingleLineMarker(html, range, '', config, 0, extraStyle);
        }
    };

    render()
    {
        let markers = [];

        if (this.state.cursors)
        {
            markers = this.state.cursors.map((c) =>
            {
                return {
                    startRow: c.row,
                    startCol: c.col,
                    endRow: c.row,
                    endCol: c.col + 1,
                    className: 'marker-test',
                    type: 'background',

                };
            });
        }

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
                    value="kreeeeeeeeeeek\nKrek"
                />;
            </div>
        );
    }
}

export default SocketEditor;
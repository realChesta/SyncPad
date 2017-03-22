/**
 * Created by Kyrill on 15.03.2017.
 */

import React, {Component} from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';
const { Range } = ace.acequire('ace/range');

import './style/SocketEditor.css';

const io = require('socket.io-client');
const jsDiff = require('diff');
const randomColor = require('randomcolor');

class SocketEditor extends Component {
    constructor(props)
    {
        super(props);
        this.oldText = '';
        this.state = { cursors: [] };
        this.cursors = {};
        this.selections = {};
        this.users = {};
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
        for (let name in this.cursors)
        {
            let index = msg.indexOf(name);
            if (index === -1)
            {
                this.editor.session.removeMarker(this.cursors[name]);
                delete this.cursors[name];
            }
        }
        for (let name in this.selections)
        {
            let index = msg.indexOf(name);
            if (index === -1)
            {
                this.editor.session.removeMarker(this.selections[name]);
                delete this.selections[name];
            }
        }

        console.log('users: ' + JSON.stringify(msg));

        for (let name in this.users)
        {
            if (msg.indexOf(name) === -1)
                delete this.users[name];
        }
        for (let i = 0; i < msg.length; i++)
        {
            if (msg[i] !== this.props.username && !this.users.hasOwnProperty(msg[i]))
            {
                let colorData = randomColor({ luminosity: 'bright', format: 'rgbArray' });
                this.users[msg[i]] = { r: colorData[0], g: colorData[1], b: colorData[2] };
            }
        }

        if (this.props.onUserlist)
            this.props.onUserlist(this.users);
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
        this.editor.selection.on('changeCursor', this.onCursor);
        this.editor.selection.on('changeSelection', this.onSelection);
        this.oldText = this.editor.getValue();
    };

    onCursor = (a, selection) =>
    {
        // console.log('cursor: ' + JSON.stringify(selection.getCursor()));
        this.socket.emit('op', {
            type: 'cursor',
            user: this.props.username,
            position: selection.getCursor()
        });
    };

    onSelection = (a, selection) =>
    {
        // console.log('selection:' + JSON.stringify(selection.getRange()) + " | empty: " + selection.isEmpty());

        let data = {
            type: 'selection',
            user: this.props.username
        };
        let range = selection.getRange();

        if (!range.isEmpty())
            data.range = range;
        else
            data.empty = true;

        this.socket.emit('op', data);
    };

    onOp = (op) =>
    {
        // let pos = this.editor.getCursorPosition();
        let selection = this.editor.getSelectionRange();
        let cancelCursor = false;

        console.log('op: ' + JSON.stringify(op));

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

            case 'cursor':
            {
                cancelCursor = true;
                if (this.cursors.hasOwnProperty(op.user))
                {
                    this.editor.session.removeMarker(this.cursors[op.user]);
                    delete this.cursors[op.user];
                }

                if (this.users.hasOwnProperty(op.user))
                {
                    let obj = this.editor.session.addDynamicMarker({
                        update: (html, markerLayer, session, config) => this.updateRemoteCursor(html, markerLayer, config, op.position, this.users[op.user])
                    });

                    this.cursors[op.user] = obj.id;
                }
            }
                break;

            case 'selection':
            {
                cancelCursor = true;
                if (this.selections.hasOwnProperty(op.user))
                {
                    this.editor.session.removeMarker(this.selections[op.user]);
                    delete this.selections[op.user];
                }

                if (this.users.hasOwnProperty(op.user) && !op.empty)
                {
                    let obj = this.editor.session.addDynamicMarker({
                        update: (html, markerLayer, session, config) => this.updateRemoteSelection(html, markerLayer, config, op.range, this.users[op.user])
                    });

                    this.selections[op.user] = obj.id;
                }
            }
                break;
        }

        if (!cancelCursor)
            this.editor.selection.setRange(selection);
        // this.editor.selection.moveTo(pos.row, pos.column);
    };

    updateRemoteCursor = (html, markerLayer, config, pos, color) =>
    {
        let style = "position: absolute; border-left: solid 2px rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5);";
        markerLayer.drawSingleLineMarker(html, new Range(pos.row, pos.column, pos.row, pos.column + 1), '', config, 0, style);
    };

    updateRemoteSelection = (html, markerLayer, config, range, color) =>
    {
        let style = "position: absolute; background-color: rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5);";

        if (range.start.row !== range.end.row)
            markerLayer.drawMultiLineMarker(html, range, '', config, style);
        else
            markerLayer.drawSingleLineMarker(html, range, '', config, 0, style);
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
                    value="kreeeeeeeeeeek"
                />;
            </div>
        );
    }
}

export default SocketEditor;
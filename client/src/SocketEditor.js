/**
 * Created by Kyrill on 15.03.2017.
 */

import React, {Component} from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';
const {Range} = ace.acequire('ace/range');
import ReactQuill from 'react-quill';
import MultiCursor from './multi-cursor.js';
import Select from 'react-select';
import CodeModes from './code-modes.js';

import 'react-quill/dist/quill.snow.css';
import './style/SocketEditor.css';
import 'react-select/dist/react-select.css'

const io = require('socket.io-client');
const jsDiff = require('diff');
const randomColor = require('randomcolor');

//TODO: highlightJS

class SocketEditor extends Component {
    constructor(props)
    {
        super(props);
        this.oldText = '';
        this.state = {cursors: [], select: {label: "Text", value: "text"}};
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
        this.socket.emit('auth', {session: this.props.session, name: this.props.username, mode: this.props.mode});
        this.socket.on('authResponse', (msg) => this.onAuthed(msg));
        this.socket.on('userlist', (msg) => this.onUserlist(msg));
        this.socket.on('op', (op) => this.onOp(op));
        this.socket.on('getSnapshot', (msg) => this.onGetContent(msg.user));
    };

    onDisconnect = () =>
    {
        if (this.props.onDisconnect)
            this.props.onDisconnect();
    };

    onAuthed = (msg) =>
    {
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
                this.ace.session.removeMarker(this.cursors[name]);
                delete this.cursors[name];
            }
        }
        for (let name in this.selections)
        {
            let index = msg.indexOf(name);
            if (index === -1)
            {
                this.ace.session.removeMarker(this.selections[name]);
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
                let colorData = randomColor({luminosity: 'bright', format: 'rgbArray'});
                this.users[msg[i]] = {r: colorData[0], g: colorData[1], b: colorData[2]};
            }
        }

        if (this.multiCursor)
            this.multiCursor.clearCursors();

        if (this.props.onUserlist)
            this.props.onUserlist(this.users);
    };

    onChange = (value) =>
    {
        if (this.ace.curOp && this.ace.curOp.command.name)
        {
            let diff = jsDiff.diffChars(this.oldText, value);
            let pos = this.ace.getCursorPosition();

            if (diff)
            {
                for (let i = 0; i < diff.length; i++)
                {
                    let op = {};
                    if (diff[i].added)
                    {
                        op.type = 'add';
                        op.position = pos;
                        op.content = diff[i].value;
                    }
                    else if (diff[i].removed)
                    {
                        op.type = 'remove';
                        op.position = pos;
                        op.length = diff[i].count;
                    }

                    if (op.type)
                        this.socket.emit('op', op);
                }
            }
        }

        this.oldText = value;
    };

    onDelta = (content, delta, source, editor) =>
    {
        if (source === 'user')
        {
            this.socket.emit('op', {type: 'delta', delta});
        }
    };

    onQuillSelectionChange = (range, source, editor) =>
    {
        if (source === 'user')
        {
            this.socket.emit('op', {type: 'cursor', user: this.props.username, position: range.index})
        }
    };

    onLoad = (editor) =>
    {
        this.ace = editor;
        this.ace.setOption('dragEnabled', false);
        this.ace.focus();
        this.ace.selection.on('changeCursor', this.onCursor);
        this.ace.selection.on('changeSelection', this.onSelection);
        this.oldText = this.ace.getValue();
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
        console.log('op', op);
        if (this.ace)
        {
            // let pos = this.ace.getCursorPosition();
            let selection = this.ace.getSelectionRange();
            let selectionStart = this.ace.session.doc.positionToIndex(selection.start);
            let selectionEnd = this.ace.session.doc.positionToIndex(selection.end);
            let cancelCursor = false;

            switch (op.type)
            {
                case 'set':
                {
                    this.ace.setValue(op.content);
                    this.setState({select: op.mode});
                }
                    break;

                case 'add':
                {
                    this.ace.session.insert(op.position, op.content);

                    let index = this.ace.session.doc.positionToIndex(op.position);

                    if (index <= selectionStart)
                        selectionStart += op.content.length;
                    if (index <= selectionEnd)
                        selectionEnd += op.content.length;
                }
                    break;

                case 'remove':
                {
                    let index = this.ace.session.doc.positionToIndex(op.position) + op.length;
                    let newPos = this.ace.session.doc.indexToPosition(index);
                    let range = new Range(op.position.row, op.position.column, newPos.row, newPos.column);
                    this.ace.session.remove(range);

                    if ((index + op.length) <= selectionStart)
                        selectionStart -= op.length;
                    if ((index + op.length <= selectionEnd))
                        selectionEnd -= op.length;
                }
                    break;

                case 'cursor':
                {
                    cancelCursor = true;
                    if (this.cursors.hasOwnProperty(op.user))
                    {
                        this.ace.session.removeMarker(this.cursors[op.user]);
                        delete this.cursors[op.user];
                    }

                    if (this.users.hasOwnProperty(op.user))
                    {
                        let obj = this.ace.session.addDynamicMarker({
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
                        this.ace.session.removeMarker(this.selections[op.user]);
                        delete this.selections[op.user];
                    }

                    if (this.users.hasOwnProperty(op.user) && !op.empty)
                    {
                        let obj = this.ace.session.addDynamicMarker({
                            update: (html, markerLayer, session, config) => this.updateRemoteSelection(html, markerLayer, config, op.range, this.users[op.user])
                        });

                        this.selections[op.user] = obj.id;
                    }
                }
                    break;


                case 'mode':
                {
                    this.setState({select: op.mode});
                }
                    break;
            }

            if (!cancelCursor)
            {
                let start = this.ace.session.doc.indexToPosition(selectionStart);
                let end = this.ace.session.doc.indexToPosition(selectionEnd);

                selection = new Range(start.row, start.column, end.row, end.column);
                this.ace.selection.setRange(selection);
            }
            // this.ace.selection.moveTo(pos.row, pos.column);
        }
        else if (this.quill)
        {
            switch (op.type)
            {
                case 'delta':
                {
                    this.quill.updateContents(op.delta);
                    this.multiCursor.applyDelta(op.delta);
                }
                    break;

                case 'cursor':
                {
                    this.multiCursor.setCursor(op.user, op.position, op.user, this.getRGBA(this.users[op.user]));
                }
                    break;
            }
        }

    };

    getRGBA(color, opacity = 0.8)
    {
        return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + opacity + ")";
    }

    updateRemoteCursor = (html, markerLayer, config, pos, color) =>
    {
        let style = "position: absolute; border-left: solid 2px " + this.getRGBA(color) + ";";
        markerLayer.drawSingleLineMarker(html, new Range(pos.row, pos.column, pos.row, pos.column + 1), '', config, 0, style);
    };

    updateRemoteSelection = (html, markerLayer, config, range, color) =>
    {
        let style = "position: absolute; background-color: " + this.getRGBA(color, 0.25) + ";";

        if (range.start.row !== range.end.row)
            markerLayer.drawMultiLineMarker(html, range, '', config, style);
        else
            markerLayer.drawSingleLineMarker(html, range, '', config, 0, style);
    };

    onGetContent = (user) =>
    {
        if (this.ace)
        {
            this.socket.emit('snapshot',
                {
                    content: this.ace.getValue(),
                    user: user,
                    mode: this.state.select
                });
        }
        else if (this.quill)
        {
            this.socket.emit('op', {type: 'delta', delta: this.quill.getContents()});
        }
    };

    fixQuillHeight = () =>
    {
        try
        {
            let toolbar = document.getElementsByClassName('ql-toolbar')[0];
            let quill = document.getElementsByClassName('ql-container')[0];
            if (toolbar && quill)
            {
                quill.style.height = 'calc(100% - ' + (toolbar.clientHeight + 2) + 'px)';
            }
        }
        catch (exception)
        {

        }
    };

    onSelectChange = (value) =>
    {
        this.setState({select: value});
        this.socket.emit('op', {type: 'mode', mode: value});
    };

    render()
    {
        let editor;

        if (this.props.mode === 'code')
        {
            editor = <div className="SocketEditor">
                <div className="SocketEditor-toolbar">
                    <div>
                        <p className="SocketEditor-toolbar-label">Mode:</p>
                        <Select className="SocketEditor-select"
                                value={this.state.select}
                                name="form-field-name"
                                options={CodeModes.getModeValues()}
                                onChange={this.onSelectChange}
                                clearable={false}
                        />
                    </div>

                </div>
                <AceEditor
                    name="ace-editor"
                    width="100%"
                    height="calc(100% - 55px)"
                    showPrintMargin={false}
                    focus={true}
                    className="SocketEditor-textbox"
                    onLoad={this.onLoad}
                    onChange={this.onChange}
                    value={this.oldText}
                    mode={this.state.select.value}
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                />
            </div>;

            console.log("select: ", this.state.select);
        }
        else if (this.props.mode === 'rtf')
        {
            let modules = {
                // syntax: true,
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
                    ['blockquote', 'code-block'],                    // blocks
                    [{'header': 1}, {'header': 2}],              // custom button values
                    [{'list': 'ordered'}, {'list': 'bullet'}],    // lists
                    [{'script': 'sub'}, {'script': 'super'}],     // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],         // outdent/indent
                    [{'direction': 'rtl'}],                        // text direction
                    [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],       // header dropdown
                    [{'color': []}, {'background': []}],         // dropdown with defaults
                    [{'font': []}],                                // font family
                    [{'align': []}],                               // text align
                    ['link', 'image', 'video'],
                    ['clean'],
                ]
            };

            let formats = [
                'header', 'font', 'background', 'color', 'code', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent', 'script', 'align', 'direction',
                'link', 'image', 'code-block', 'formula', 'video'
            ];

            editor =
                <ReactQuill
                    className="SocketEditor"
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    ref={(el) =>
                    {
                        if (el)
                        {
                            this.quill = el.getEditor();
                            this.multiCursor = new MultiCursor(this.quill, {});
                            this.fixQuillHeight();
                        }
                    }}
                    onChange={this.onDelta}
                    onChangeSelection={this.onQuillSelectionChange}
                />;

            // editor = <RTFeditor
            //     className="SocketEditor-textbox"
            //     onDelta={this.onDelta}
            // />;

        }
        else if (this.props.onDisconnect)
        {
            this.props.onDisconnect();
        }

        return (
            editor
        );
    }
}

export default SocketEditor;
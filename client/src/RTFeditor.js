import React, {Component} from 'react'
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import './style/RTFeditor.css';

//TODO: highlightJS

class RTFeditor extends Component {

    constructor(props)
    {
        super(props);

        this.modules = {
            // syntax: true,
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
                ['blockquote', 'code-block'],                    // blocks
                [{ 'header': 1 }, { 'header': 2 }],              // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // lists
                [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
                [{ 'direction': 'rtl' }],                        // text direction
                [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // header dropdown
                [{ 'color': [] }, { 'background': [] }],         // dropdown with defaults
                [{ 'font': [] }],                                // font family
                [{ 'align': [] }],                               // text align
                ['link', 'image', 'video'],
                ['clean'],
            ]
        };

        this.formats = [
            'header', 'font', 'background', 'color', 'code', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent', 'script', 'align', 'direction',
            'link', 'image', 'code-block', 'formula', 'video'
        ];
    }

    componentDidMount = () =>
    {
        if (this.reactQuillRef)
            this.reactQuillRef.focus();
    };

    onChange = (content, delta, source, editor) =>
    {
        if (source === 'user')
        {
            if (this.props.onDelta)
                this.props.onDelta(delta.changes);
        }
    };

    render()
    {
        return (
            <div className="RTFE">
                <ReactQuill
                    className="RTFE"
                    theme="snow"
                    modules={this.modules}
                    formats={this.formats}
                    ref={(el) =>
                    {
                        this.reactQuillRef = el;
                    }}
                    onChange={this.onChange}
                />
            </div>
        );
    }

}

export default RTFeditor;
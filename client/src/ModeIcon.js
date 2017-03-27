/**
 * Created by Kyrill on 27.03.2017.
 */

import React, {Component} from 'react';

import './style/ModeIcon.css'

class ModeIcon extends Component {

    render()
    {
        return (
            <p
                className={this.props.mode === 'rtf' ? "ModeIcon ModeIcon-rtf" : "ModeIcon ModeIcon-code"}
                style={this.props.style}>
                {this.props.mode === 'rtf' ? "Aa" : "</>"}
                <span className="tooltip">{this.props.mode === 'rtf' ? "Rich Text mode" : "Code mode"}</span>
            </p>
        );
    }
}

export default ModeIcon;
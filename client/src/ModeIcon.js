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
                className={this.props.mode === 'rtf' ? "ModeIcon-rtf" : "ModeIcon-code"}
                style={this.props.style}>
                {this.props.mode === 'rtf' ? "Aa" : "</>"}
            </p>
        );
    }
}

export default ModeIcon;
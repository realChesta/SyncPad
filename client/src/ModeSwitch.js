/**
 * Created by Kyrill on 27.03.2017.
 */

import React, {Component} from 'react';
import {spring, Motion} from 'react-motion';

import './style/ModeSwitch.css';

class ModeSwitch extends Component {

    constructor(props)
    {
        super(props);

        this.state = {mode: 'code'};
    }

    getMode = () =>
    {
        return this.state.mode === 'rtf';
    };

    onClick = () =>
    {
        this.setState({mode: this.getMode() ? 'code' : 'rtf'});

        if (this.props.onChange)
            this.props.onChange(this.state.mode);
    };

    render()
    {
        return (
            <div className="ModeSwitch-container">
                <p className="ModeSwitch-text-rtf">{"Aa"}</p>
                <div className="ModeSwitch" onClick={this.onClick}>
                    <Motion onClick={this.onClick} style={{
                        x: spring(this.getMode() ? 16 : 0),
                        r: spring(this.getMode() ? 208 : 92),
                        g: spring(this.getMode() ? 88 : 133),
                        b: spring(this.getMode() ? 42 : 214),
                    }}>
                        {({x, r, g, b}) =>
                            <div className="ModeSwitch-nob" style={{
                                transform: "translateX(" + x + "px)",
                                backgroundColor: "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")"
                            }}/>
                        }
                    </Motion>
                </div>
                <p className="ModeSwitch-text-code">{"</>"}</p>
            </div>
        );
    }
}

export default ModeSwitch;
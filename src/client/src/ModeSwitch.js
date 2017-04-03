/**
 * Created by Kyrill on 27.03.2017.
 */

import React, {Component} from 'react';
import {spring, Motion} from 'react-motion';
import ModeIcon from './ModeIcon.js';

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
            <Motion onClick={this.onClick} style={{
                x: spring(this.getMode() ? 16 : 0, {stiffness: 200, damping: 15}),
                r: spring(this.getMode() ? 208 : 92),
                g: spring(this.getMode() ? 88 : 133),
                b: spring(this.getMode() ? 42 : 214),
                s: spring(this.getMode() ? 60: 0),
            }}>
                {({x, r, g, b, s}) =>
                    <div className="ModeSwitch-container">
                        <ModeIcon mode={"rtf"} style={{color: "hsl(220," + Math.abs(Math.round(60 - s)) + "%, 60%)"}}/>
                        <div className="ModeSwitch" onClick={this.onClick}>
                            <div className="ModeSwitch-nob" style={{
                                transform: "translateX(" + x + "px)",
                                backgroundColor: "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")",
                            }}/>
                        </div>
                        <ModeIcon mode={"code"} style={{color: "hsl(17, " + Math.round(s) + "%, 60%)"}}/>
                    </div>
                }
            </Motion>
        );
    }
}

export default ModeSwitch;
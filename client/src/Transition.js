/**
 * Created by Kyrill on 05.03.2017.
 */

import React, {Component} from 'react';
import {spring, TransitionMotion, presets} from 'react-motion';

class Transition extends Component {
    render()
    {
        return (
            <TransitionMotion
                styles=
                    {
                        this.props.children ? [
                                {key: this.props.children.key, style: this.getStyles(), data: this.props.children}
                            ] : []
                    }
                willLeave={this.willLeave}
                willEnter={this.willEnter}
            >
                { int =>
                    <div style={{clear: "both"}}>
                        {int.map(({key, style, data}) =>
                            <div key={`${key}-transition`} style={
                                {
                                    opacity: style.opacity,
                                    transform: `scale(${style.scale})`,
                                    clear: "both"
                                }}>
                                {data}
                            </div>
                        )}
                    </div>
                }
            </TransitionMotion>
        );
    }

    willEnter()
    {
        return {
            opacity: 0,
            scale: 0.98
        };
    }

    willLeave()
    {
        return {
            opacity: spring(0),
            scale: spring(1.02)
        };
    }

    getStyles()
    {
        return {
            opacity: spring(1),
            scale: spring(1)
        };
    }
}

export default Transition;
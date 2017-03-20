/**
 * Created by Kyrill on 07.03.2017.
 */

import React, {Component} from 'react';
import {spring, TransitionMotion} from 'react-motion';

class SwipeTransition extends Component {
    render()
    {
        return (
            <TransitionMotion
                style={{ position: "absolute", width: "100%", height: "100%"}}
                styles={
                    this.props.children ? [
                            { key: this.props.children.key, style: this.getStyles(), data: this.props.children }
                        ] : []
                }
                willLeave={this.willLeave}
                willEnter={this.willEnter}
            >
                { int =>
                    <div style={{ position: "absolute", clear: "both", width: "100%", height: "100%"}}>
                        {int.map(({ key, style, data }) =>
                            <div key={`${key}-transition`} style={
                                {
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    opacity: style.opacity,
                                    transform: `translateX(${style.x}%)`,
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
            x: 5
        };
    }

    willLeave()
    {
        return {
            opacity: spring(0),
            x: spring(-5)
        };
    }

    getStyles()
    {
        return {
            opacity: spring(1),
            x: spring(0)
        };
    }
}

export default SwipeTransition;
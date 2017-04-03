/**
 * Created by Kyrill on 05.03.2017.
 */

import React, {Component} from 'react';
import {spring, TransitionMotion} from 'react-motion';

class FadeTransition extends Component {
    render()
    {
        return (
            <TransitionMotion
                style={{ position: "absolute", width: "100%", height: "100%" }}
                styles={
                    this.props.children ? [
                            { key: this.props.children.key, style: this.getStyles(), data: this.props.children }
                        ] : []
                }
                willLeave={this.willLeave}
                willEnter={this.willEnter}
            >
                { int =>
                    <div style={{ clear: "both" }}>
                        {int.map(({ key, style, data }) =>
                            <div key={`${key}-transition`} style={
                                {
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
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

    willEnter = () =>
    {
        return {
            opacity: 0,
            scale: 0.98
        };
    };

    willLeave = () =>
    {
        let val = this.props.fullscreenFriendly ? 1 : 1.02;
        return {
            opacity: spring(0),
            scale: spring(val)
        };
    };

    getStyles = () =>
    {
        return {
            opacity: spring(1),
            scale: spring(1)
        };
    };
}

export default FadeTransition;
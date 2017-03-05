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
                                { key: this.props.children.key, style: this.getStyles(), data: this.props.children }
                            ] : []
                    }
                willLeave={this.willLeave}
                willEnter={this.willEnter}
            >
                { int =>
                    <div>
                        {int.map(({ key, style, data }) =>
                            <div key={`${key}-transition`} style={{ opacity: style.opacity }}>
                                {data}
                            </div>
                        )}
                    </div>}
            </TransitionMotion>
        );
    }

    willEnter()
    {
        return {
            opacity: 0
        };
    }

    willLeave()
    {
        return {
            opacity: spring(0)
        };
    }

    getStyles()
    {
        return {
            opacity: spring(1)
        };
    }
}

export default Transition;
/**
 * Created by Kyrill on 14.03.2017.
 */

import React, {Component} from 'react';

import './style/ErrorBox.css';

class ErrorBox extends Component {

    render()
    {
        return (
            <div className="ErrorBox-outer">
                <div className="ErrorBox-inner">
                    <p className="ErrorBox-sadface">:(</p>
                    <div className="ErrorBox-content">
                        <p className="ErrorBox-title">{this.props.title}</p>
                        <p className="ErrorBox-text">{this.props.message}</p>
                    </div>
                </div>
            </div>
        );
    }

}

export default ErrorBox;
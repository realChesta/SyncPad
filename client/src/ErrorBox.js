/**
 * Created by Kyrill on 14.03.2017.
 */

import React, {Component} from 'react';

import './style/ErrorBox.css';

class ErrorBox extends Component {

    render()
    {
        return (
            <div className="ErrorBox">
                <p className="ErrorBox.text">{this.props.message}</p>
            </div>
        );
    }

}
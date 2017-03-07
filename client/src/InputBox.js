/**
 * Created by Kyrill on 07.03.2017.
 */

import React, {Component} from 'react';
import './style/InputBox.css'

class InputBox extends Component {

    constructor(props)
    {
        super(props);

        this.state = { sessionName: ''};
    }

    handleChange = (e) =>
    {
        this.setState({ sessionName: e.target.value });
    };

    handleKeyPress = (e) =>
    {
        if (e.key == 'Enter')
        {
            this.props.onDone(this.state.sessionName);
        }
    };

    handleClose = (e) =>
    {
        this.props.onDone();
    };

    handleConfirm = (e) =>
    {
        this.props.onDone(this.state.sessionName)
    };

    render()
    {
        return (
            <div className="IB">
                    <div className="IB-title">
                        <p className="IB-title-span">{this.props.title}</p>
                        <button onClick={this.handleClose} className="IB-close"/>
                    </div>
                    <div className="IB-body">
                        <p className="IB-body-text">{this.props.text}</p>
                        <input onChange={this.handleChange} onKeyPress={this.handleKeyPress} className="IB-body-input"/>
                        <button disabled={!this.state.sessionName} onClick={this.handleConfirm} className="g-button IB-acceptButton">{this.props.action}</button>
                    </div>
            </div>
        );
    }
}

export default InputBox;
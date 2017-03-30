/**
 * Created by Kyrill on 15.03.2017.
 */

import React, {Component} from 'react';

import './style/InputBox.css'
import ModeSwitch from "./ModeSwitch";

class CreateSessionBox extends Component {

    constructor(props)
    {
        super(props);

        this.state = {username: '', sessionName: '', mode: 'rtf'};
    }

    handleUserChange = (e) =>
    {
        this.setState({username: e.target.value});
    };

    handleSessionChange = (e) =>
    {
        this.setState({sessionName: e.target.value});
    };

    handleKeyUp = (e) =>
    {
        if ((e.keyCode === 13) && this.state.sessionName && this.state.username)
        {
            this.props.onDone(this.state.username, this.state.sessionName, this.state.mode);
        }
        else if (e.keyCode === 27)
        {
            this.props.onDone();
        }
    };

    handleModeChange = (mode) =>
    {
        this.setState({mode: mode});
    };

    handleClose = (e) =>
    {
        this.props.onDone();
    };

    handleConfirm = (e) =>
    {
        this.props.onDone(this.state.username, this.state.sessionName, this.state.mode)
    };

    componentDidMount()
    {
        this.userInput.focus();
    }

    render()
    {
        return (
            <div className="IB">
                <div className="IB-title">
                    <p className="IB-title-span">{this.props.title}</p>
                    <button onClick={this.handleClose} className="IB-close"/>
                </div>
                <div className="IB-body">
                    <p className="IB-body-text">{this.props.userText}</p>
                    <input onChange={this.handleUserChange} onKeyUp={this.handleKeyUp} value={this.props.preUser} className="IB-body-input"
                           ref={(input) =>
                           {
                               this.userInput = input;
                           }}/>
                    <p className="IB-body-text">{this.props.sessionText}</p>
                    <input onChange={this.handleSessionChange} onKeyUp={this.handleKeyUp} className="IB-body-input"/>
                    <p className="IB-body-text">{this.props.selectText}</p>
                    <ModeSwitch onChange={this.handleModeChange}/>
                    <button disabled={!(this.state.sessionName && this.state.username)} onClick={this.handleConfirm}
                            className="g-button IB-acceptButton">{this.props.action}</button>
                </div>
            </div>
        );
    }
}

export default CreateSessionBox;
/**
 * Created by Kyrill on 07.03.2017.
 */

import React, {Component} from 'react';
import './style/InputBox.css'

class InputBox extends Component {

    constructor(props)
    {
        super(props);

        this.state = { input: this.props.preUser};
    }

    handleChange = (e) =>
    {
        this.setState({ input: e.target.value });
    };

    handleKeyUp = (e) =>
    {
        if ((e.keyCode === 13) && this.state.input)
        {
            this.props.onDone(this.state.input);
        }
        else if (e.keyCode === 27)
        {
            this.props.onDone();
        }
    };

    handleClose = (e) =>
    {
        this.props.onDone();
    };

    handleConfirm = (e) =>
    {
        this.props.onDone(this.state.input)
    };

    componentDidMount()
    {
        this.inputBox.focus();
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
                        <p className="IB-body-text">{this.props.text}</p>
                        <input onChange={this.handleChange} onKeyUp={this.handleKeyUp} className="IB-body-input" value={this.state.input} ref={(input) => { this.inputBox = input; }}/>
                        <button disabled={!this.state.input} onClick={this.handleConfirm} className="g-button IB-acceptButton">{this.props.action}</button>
                    </div>
            </div>
        );
    }
}

export default InputBox;
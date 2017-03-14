/*
 * Created by Kyrill on 03.03.2017.
 */

import React, {Component} from 'react';
import './style/SessionDisplayer.css';

class SessionDisplayer extends Component {

    render()
    {
        var rows = [];

        if (this.props.data)
        {
            let ch = this.props.connectHandler;
            rows = this.props.data.map(function (d)
            {
                return (
                    <tr key={d.name}>
                        <td>{d.name}</td>
                        <td>{d.users}</td>
                        <td>
                            <button id={d.name} onClick={ch(d.name)} className="g-button c-button">Connect</button>
                        </td>
                    </tr>
                );
            });
        }

        return (
            <div className="SD">
                <table className="SD-table">
                    <tr>
                        <th>Session name</th>
                        <th>Connected users</th>
                        <th/>
                    </tr>
                    {rows}
                </table>
            </div>
        );
    }
}

export default SessionDisplayer;

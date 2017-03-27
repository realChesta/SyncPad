/*
 * Created by Kyrill on 03.03.2017.
 */

import React, {Component} from 'react';
import ModeIcon from './ModeIcon.js';

import './style/SessionDisplayer.css';
import './style/ModeSwitch.css';

class SessionDisplayer extends Component {

    clickHandler = (e) =>
    {
        this.props.connectHandler(this.props.data[e.currentTarget.id].name, this.props.data[e.currentTarget.id].mode);
    };

    render()
    {
        var rows = [];

        if (this.props.data)
        {
            let ch = this.clickHandler;
            rows = this.props.data.map(function (d, i)
            {
                return (
                    <tr key={i}>
                        <td>{d.name}</td>
                        <td><ModeIcon mode={d.mode}/></td>
                        <td>{d.users}</td>
                        <td>
                            <button id={i} onClick={ch} className="g-button c-button">Connect</button>
                        </td>
                    </tr>
                );
            });
        }

        return (
            <div className="SD">
                {rows.length > 0 ?
                    (<table className="SD-table">
                        <tr>
                            <th>Session name</th>
                            <th>Mode</th>
                            <th>Connected users</th>
                            <th/>
                        </tr>
                        {rows}
                    </table>)
                    :
                    (<div className="SD-empty">
                        <p className="SD-empty-text">There are no existing sessions.</p>
                    </div>)
                }
            </div>
        );
    }
}

export default SessionDisplayer;

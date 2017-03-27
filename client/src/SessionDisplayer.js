/*
 * Created by Kyrill on 03.03.2017.
 */

import React, {Component} from 'react';
import './style/SessionDisplayer.css';
import './style/ModeSwitch.css';

class SessionDisplayer extends Component {

    clickHandler = (e) =>
    {
        this.props.connectHandler(e.currentTarget.id, e.currentTarget.mode);
    };

    render()
    {
        var rows = [];

        if (this.props.data)
        {
            let ch = this.clickHandler;
            rows = this.props.data.map(function (d)
            {
                let modeItem = <p className={d.mode === 'rtf' ? "ModeSwitch-text-rtf" : "ModeSwitch-text-code"}>{d.mode === 'rtf' ? "Aa" : "</>"}</p>;

                return (
                    <tr key={d.name}>
                        <td>{d.name}</td>
                        <td>{modeItem}</td>
                        <td>{d.users}</td>
                        <td>
                            <button mode={d.mode} id={d.name} onClick={ch} className="g-button c-button">Connect</button>
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

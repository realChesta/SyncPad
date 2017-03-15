/**
 * Created by Kyrill on 15.03.2017.
 */

import React, {Component} from 'react';

class SocketEditor extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div className="SocketEditor">
                <textarea className="SocketEditor-textbox"/>
            </div>
        );
    }
}

export default SocketEditor;
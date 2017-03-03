/**
 * Created by Kyrill on 03.03.2017.
 */

import React, {Component} from 'react';
import './style/Loader.css';

class Loader extends Component {
    render()
    {
        return (
            <div className="Loader">
                <div className="outer">
                    <div className="middle">
                        <div className="loader">
                            <svg className="circular" viewBox="25 25 50 50">
                                <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth={1}/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loader;
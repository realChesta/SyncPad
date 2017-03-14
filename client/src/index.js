import React from 'react';
import ReactDOM from 'react-dom';

import LandingApp from './LandingApp.js';
import SwipeTransition from './SwipeTransition.js';
import EditingApp from './EditingApp.js';

import './index.css';

const rp = require('request-promise');

//TODO: implement error display

var data = [
    {
        name: "Krek",
        users: 5,
        id: "test"
    },
    {
        name: "Test",
        users: 9,
        id: "test2"
    },
    {
        name: "Topkek",
        users: 16,
        id: "test3"
    }
];

var data2 = [
    {
        name: "Krek",
        users: 5,
        id: "test"
    }
];

function refreshData()
{
    rp('http://172.20.10.6/getSessions')
        .then(function (body)
        {
            let data = JSON.parse(body);

            console.log("got answer");
            console.log(data);

            ReactDOM.render(
                <SwipeTransition>
                    <LandingApp
                        key="welcomeApp"
                        refreshHandler={refreshData}
                        createHandler={createSession}
                        connectHandler={connectClick}
                        tableData={data}
                    />
                </SwipeTransition>,
                document.getElementById('root')
            );
        })
        .catch(function(error)
        {
            console.error(error);
        });
}

function createSession(sname)
{
    console.warn("create session hasn't been implemented yet");
    ReactDOM.render(
        <SwipeTransition>
            <EditingApp key="EA" title={sname}/>
        </SwipeTransition>,
        document.getElementById('root')
    );
}

function connectClick()
{
    console.warn("connecting hasn't been implemented yet");
}

ReactDOM.render(
    <SwipeTransition>
        <LandingApp
            key="welcomeApp"
            refreshHandler={refreshData}
            createHandler={createSession}
            connectHandler={connectClick}
        />
    </SwipeTransition>,
    document.getElementById('root')
);

refreshData();
//createSession();
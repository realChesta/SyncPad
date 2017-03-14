import React from 'react';
import ReactDOM from 'react-dom';

import LandingApp from './LandingApp.js';
import SwipeTransition from './SwipeTransition.js';
import EditingApp from './EditingApp.js';
import SessionClient from './SessionClient.js';

import './style/index.css';

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
            console.log(body);
            let data = JSON.parse(body);

            console.log("got answer");
            console.log(data);

            ReactDOM.render(
                <SwipeTransition>
                    <LandingApp
                        key="welcomeApp"
                        refreshHandler={refreshData}
                        createHandler={joinSession}
                        connectHandler={joinSession}
                        tableData={data}
                    />
                </SwipeTransition>,
                document.getElementById('root')
            );
        })
        .catch(function(error)
        {
            console.error("Failed to get session list! " + error.message);
        });
}

function joinSession(sname)
{
    let sc = new SessionClient("krekboy", sname);
    sc.connect();
}

function startEditor(sClient)
{
    ReactDOM.render(
        <SwipeTransition>
            <EditingApp key="EA" title={sClient.name}/>
        </SwipeTransition>,
        document.getElementById('root')
    );
}

ReactDOM.render(
    <SwipeTransition>
        <LandingApp
            key="welcomeApp"
            refreshHandler={refreshData}
            createHandler={joinSession}
            connectHandler={joinSession}
        />
    </SwipeTransition>,
    document.getElementById('root')
);

refreshData();
//createSession();
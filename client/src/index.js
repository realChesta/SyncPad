import React from 'react';
import ReactDOM from 'react-dom';

import LandingApp from './LandingApp.js';
import SwipeTransition from './SwipeTransition.js';
import EditingApp from './EditingApp.js';

import './style/index.css';

const rp = require('request-promise');

//TODO: prevent user from accidentally leaving editing page
//TODO: fix too long usernames clipping out of bounds

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
    ReactDOM.render(
        <SwipeTransition>
            <LandingApp
                key="welcomeApp"
                refreshHandler={refreshData}
                joinHandler={joinSession}
            />
        </SwipeTransition>,
        document.getElementById('root')
    );

    rp({
        url: 'http://localhost/getSessions',
        timeout: 5000
    })
        .then(function (body)
        {
            console.log(body);
            let data = JSON.parse(body);

            console.log("session list", body);

            ReactDOM.render(
                <SwipeTransition>
                    <LandingApp
                        key="welcomeApp"
                        refreshHandler={refreshData}
                        joinHandler={joinSession}
                        tableData={data}
                    />
                </SwipeTransition>,
                document.getElementById('root')
            );
        })
        .catch(function (error)
        {
            console.error("Failed to get session list! " + error.message);

            ReactDOM.render(
                <SwipeTransition>
                    <LandingApp
                        key="welcomeApp"
                        refreshHandler={refreshData}
                        joinHandler={joinSession}
                        error={{title: "Something went wrong", message: "Could not get session list!", error: error}}
                    />
                </SwipeTransition>,
                document.getElementById('root')
            );
        });
}

function onDisconnect()
{
    refreshData();
}

function onError(msg)
{
    ReactDOM.render(
        <SwipeTransition>
            <LandingApp
                key="welcomeApp"
                refreshHandler={refreshData}
                joinHandler={joinSession}
                error={{title: "Something went wrong", message: msg}}
            />
        </SwipeTransition>,
        document.getElementById('root')
    );
}

function joinSession(user, session, mode)
{
    if (!mode)
    {
        console.warn("No mode has been set! using 'code'");
        mode = 'code';
    }

    //TODO: implement mode on join

    ReactDOM.render(
        <SwipeTransition>
            <EditingApp
                key="EditingApp"
                session={session}
                username={user}
                mode={mode}
                onDisconnect={onDisconnect}
                onError={onError}
            />
        </SwipeTransition>,
        document.getElementById('root')
    );
}

ReactDOM.render(
    <SwipeTransition SwipeTransition>
        <LandingApp
            key="welcomeApp"
            refreshHandler={refreshData}
            joinHandler={joinSession}
        />
    </SwipeTransition>,
    document.getElementById('root')
);

refreshData();
//createSession();
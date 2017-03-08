import React from 'react';
import ReactDOM from 'react-dom';

import LandingApp from './LandingApp.js';
import SwipeTransition from './SwipeTransition.js';
import EditingApp from './EditingApp.js';

import './index.css';

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
    doMain();
}

function createSession(sname)
{
    console.warn("create session hasn't been implemented yet");
    ReactDOM.render(
        <SwipeTransition>
            <EditingApp key="EA"/>
        </SwipeTransition>,
        document.getElementById('root')
    );
}

function connectClick()
{
    console.warn("connecting hasn't been implemented yet");
}

function doMain()
{
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

    setTimeout(function ()
    {
        ReactDOM.render(
            <SwipeTransition>
                <LandingApp
                    key="welcomeApp"
                    refreshHandler={refreshData}
                    createHandler={createSession}
                    connectHandler={connectClick}
                    tableData={Math.random() < 0.5 ? data : data2}
                />
            </SwipeTransition>,
            document.getElementById('root')
        );
    }, 3000);
}

//doMain();
createSession();
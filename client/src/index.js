import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

//TODO: React Motion: https://medium.com/@nashvail/a-gentle-introduction-to-react-motion-dc50dd9f2459

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

function createSession()
{
    console.warn("create session hasn't been implemented yet");
}

function connectClick()
{
    console.warn("connecting hasn't been implemented yet");
}

function doMain()
{
    ReactDOM.render(
        <App
            refreshHandler={refreshData}
            createHandler={createSession}
            connectHandler={connectClick}
        />,
        document.getElementById('root')
    );

    setTimeout(function ()
    {
        ReactDOM.render(
            <App
                refreshHandler={refreshData}
                createHandler={createSession}
                connectHandler={connectClick}
                tableData={Math.random() < 0.5 ? data : data2}
            />,
            document.getElementById('root')
        );
    }, 3000);
}

doMain();
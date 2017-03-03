import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var data = [
    {
        name: "Krek",
        users: 5,
        id: "test"
    }
];

ReactDOM.render(
    <App tableData={data}/>,
    document.getElementById('root')
);

// setTimeout(function()
// {
//     ReactDOM.render(
//         <App tableData={{ test: "Hallo" }}/>,
//         document.getElementById('root')
//     );
//     console.log("timer expired");
// }, 3000);
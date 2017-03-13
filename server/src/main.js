var socketIO = require('socket.io');
var express = require('express');

function generateGUID() {
    let s4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
};

var sessionList = {
    id1: {name: "Krek1", content: {}, users: {}}
};

function getInfo() {
    let listSessions = [];
    for (let session in sessionList) {
        let obj = {
            id: session,
            name: sessionList[session].name,
            content: sessionList[session].content,
            users: sessionList[session].users.length
        };
        listSessions.push(obj);
    }

    return listSessions;
}

var app = express();

app.get('/', function (req, res) {
    res.send("Error 404");
});
app.get('/gitGud', function (req, res) {
    res.send("EASTERGGS");
});
app.get('/getSessions', function (req, res) {
    res.send(JSON.stringify(getInfo()));
});

app.listen(80, function () {
    console.log("Krekosaurus");
});
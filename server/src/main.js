var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var Session = require("./Session.js");

var sessionList = {};

function getInfo() {
    let listSessions = [];
    for (let sessions in sessionList) {
        let obj = {
            name: sessions,
            users: sessionList[sessions].users.length,
            mode: sessionList[sessions].mode
        };
        listSessions.push(obj);
    }
    return listSessions;
}
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.send("Error 404");
});
app.get('/gitGud', function (req, res) {
    res.send("EASTERGGS");
});
app.get('/getSessions', function (req, res) {
    res.send(JSON.stringify(getInfo()));
});

http.listen(80, function () {
    console.log("Krekosaurus");
});

function onSessionEmpty(session)
{
    delete sessionList[session];
    console.log("Session "+session+" ended because everyone left.")
}

function checkSession(data) {
    for (let session in sessionList) {
        if (data.session === session) {
            return true;
        }
    }
    return false;
}

function onAuth(socket, data) {
    console.log('auth');
    if (!checkSession(data)) {
        let userData = {socket: socket, name: data.name};
        sessionList[data.session] = new Session(data.session, userData, data.mode, onSessionEmpty);
        let msg = {state: true, msg: "Successfully created a new session."};
        socket.emit('authResponse', msg);
        console.log(data.name + (" created a session named " + data.session));
    }
    else {
            sessionList[data.session].addUser(socket, data);
    }
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('auth', _.partial(onAuth, socket));
});
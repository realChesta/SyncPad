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
            users: sessionList[sessions].users.length
        };
        listSessions.push(obj);
    }

    return listSessions;
}

function checkSession(usr) {
    for (let session in sessionList) {
        if (usr.session === session) {
            return true;
        }
    }
    return false;
}

function checkUser(session) {
    for (let user in session.users) {
        if (session.name === user) {
            return true;
        }
    }
    return false;
}
//TODO: Remove session when no user inside
//TODO: Remove session on command

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

function onAuth(socket, usr) {
    console.log('auth');
    if (!checkSession(usr)) {
        let userData = {socket: socket, name: usr.name};
        sessionList[usr.session] = new Session(usr.session, userData, onSessionEmpty);
        let msg = {state: true, msg: "Successfully created a new session."};
        socket.emit('authResponse', msg);
        console.log(usr.name + (" created a session named " + usr.session));
    }
    else {
        if (checkUser(usr)) {
            console.log("Occupied");
            let msg = {state: false, msg: "Another user with the same name is already in this session."};
            socket.emit('authResponse', msg)
        }
        else {
            let session = sessionList[usr.session];
            session.users.push({socket: socket, name: usr.name});
            console.log(usr.name + " connected to " + usr.session);
            let msg = {state: true, msg: "Successfully joined " + usr.session + "."};
            socket.emit('authResponse', msg);
            session.registerSocket(socket);
        }
    }
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('auth', _.partial(onAuth, socket));
});
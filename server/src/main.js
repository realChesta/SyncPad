var socketIO = require('socket.io');
var express = require('express');
var http = require('http');
var app = express();
var io = require('socket.io')(http);

function generateGUID() {
    let s4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
};

var sessionList = {
    "Krek1": {session: "Krek1", content: {}, users: ["Krekosaurus", "Adolf", "Merkel"]},
    "Sample2": {session: "Sample2", content: {}, users: ["Loner"]},
    "Max Muster": {session: "Max Muster", content: {}, users: ["Fax Fuster", "Dax Duster"]}
};

function getInfo() {
    let listSessions = [];
    for (let session in sessionList) {
        let obj = {
            sessionName: sessionList[session].name,
            content: sessionList[session].content,
            users: sessionList[session].users.length
        };
        listSessions.push(obj);
    }

    return listSessions;
}

function checkSession(usr) {
    for (let session in sessionList) {
        if (usr.session === session.sessionName) {
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
app.listen(80, function () {
    console.log("Krekosaurus");
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('auth', function (usr) {
        if (!checkSession(usr)) {
            sessionList[usr.session] = {
                sessionName: usr.session,
                content: '',
                users: [usr.name]
            };
        }
        else {
            if (checkUser(usr)) {
                console.log("Occupied");
            }
            else {
                sessionList[usr.session].users.push(usr.name);
            }
        }
    });
});

io.on('auth', function (socket) {

});
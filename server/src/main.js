var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var sessionList = {
    "Krek1": {content: {}, users: ["Krekosaurus", "Adolf", "Merkel"]},
    "Sample2": {content: {}, users: ["Loner"]},
    "Max Muster": {content: {}, users: ["Fax Fuster", "Dax Duster"]}
};
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

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function (socket) {
        console.log('a user disconnected');
    });
    socket.on('auth', function (usr) {
        console.log('auth');
        if (!checkSession(usr)) {
            sessionList[usr.session] = {
                content: '',
                users: [{socket: socket, name: usr.name}]
            };
            console.log(usr.name + (" created a session named " + usr.session))
        }
        else {
            if (checkUser(usr)) {
                console.log("Occupied");
            }
            else {
                sessionList[usr.session].users.push({socket: socket, name: usr.name});
                console.log(usr.name + " connected to " + usr.session)
            }
        }
    });
});
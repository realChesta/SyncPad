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
    id1: {name: "Krek1", content: {}, users: ["Krekosaurus", "Adolf", "Merkel"]},
    id2: {name: "Sample2", content: {}, users: ["Loner"]},
    id3: {name: "Max Muster", content: {}, users: ["Fax Fuster","Dax Duster"]}
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

app.use(function(req, res, next) {
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

io.on('connection', function(socket){
    console.log('a user connected');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('auth', function(socket) {
    socket.on('auth', function(usr){
        if (usr.name =)
    })
})

io.on('join', function(socket) {
})

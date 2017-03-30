module.exports = class Session {

    constructor(name, user, mode, onSessionEmpty) {
        this.name = name;
        this.users = [user];
        this.mode = mode;
        this.onSessionEmpty = onSessionEmpty;
        this.registerSocket(user.socket);
    }
    broadcast(packet, data) {
        for (let i = 0; i < this.users.length; i++) {
            this.users[i].socket.emit(packet, data);
        }
    }

    getUserList() {
        return this.users.map(function(user) {
            return user.name;
        });
    }

    broadcastOp(data, socket) {
        console.log("Recieved an op-packet");
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].socket != socket) {
                this.users[i].socket.emit('op', data);
            }
        }
    }
    getSnapshot(name) {
        this.users[0].socket.emit('getSnapshot', {user: name});
    }

    onSnapshot(data) {
        console.log("onSnapshot");
        for (let i = 0; i < this.users.length; i++) {
            if (data.user === this.users[i].name) {
                let content = {type: "set", content: data.content, mode: data.mode };
                this.users[i].socket.emit('op', content);
                console.log("snapshot sent");
                break;
            }
        }

    }

    onSocketDisconnect(socket) {
        console.log("disconnect");
        for (let i = 0; i < this.users.length; i++) {
            if (socket === this.users[i].socket) {
                console.log(this.users[i].name + " left the session.");
                this.users.splice(i, 1);
                break;
            }
        }
        if (this.users.length === 0) {
            this.onSessionEmpty(this.name);
        }
        else {
            this.broadcast('userlist', this.getUserList());
        }
    }

    registerSocket(socket) {
        socket.on('disconnect', () => this.onSocketDisconnect(socket));
        socket.on('op', (data) => this.broadcastOp(data, socket));
        socket.on('snapshot', (data) => this.onSnapshot(data));
    }

    checkUser(name) {
        for (let i = 0; i < this.users.length; i++) {
            if (name === this.users[i].name) {
                return true;
            }
        }
        return false;
    }

    addUser(socket, data) {
        if (!this.checkUser(data.name)) {
            console.log('requesting snapshot');
            this.getSnapshot(data.name);
            this.users.push({socket: socket, name: data.name});
            let msg = {state: true, msg: "Successfully joined " + data.session + "."};
            socket.emit('authResponse', msg);
            console.log(data.name + " connected to " + data.session);
            this.registerSocket(socket);
            this.broadcast('userlist', this.getUserList());
        }
        else {
            let msg = {state: false, msg: "Another user with the same name is already in this session."};
            socket.emit('authResponse', msg);
            console.log("User failed to join "+this.name+" because of the name")
        }
    }
};
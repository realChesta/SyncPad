module.exports = class Session {

    constructor(name, user, onSessionEmpty) {
        this.name = name;
        this.users = [user];
        this.onSessionEmpty = onSessionEmpty;
        this.registerSocket(user.socket);
    }

    registerSocket(socket) {
        socket.on('disconnect', this.onSocketDisconnect);
    }

    onSocketDisconnect(socket) {
        for (let user in this.users) {
            if (socket === user.socket) {
                let index = this.users.indexOf(user);
                this.users.splice(index, 1);
                console.log(user+" left the session.");
            }
            if (this.users.length === 0) {
                this.onSessionEmpty(this.name);
            }
        }
    }
};
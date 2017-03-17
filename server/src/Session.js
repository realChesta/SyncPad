module.exports = class Session {

    constructor(name, user, onSessionEmpty) {
        this.name = name;
        this.users = [user];
        this.onSessionEmpty = onSessionEmpty;
        this.registerSocket(user.socket);
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
    };

    registerSocket(socket) {
        socket.on('disconnect', () => this.onSocketDisconnect(socket));
    }

};
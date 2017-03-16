class Session {

    constructor(name, user) {
        this.name = name;
        this.users = [user];
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
            }
            if (this.users.length === 0) {

            }
        }
    }


}

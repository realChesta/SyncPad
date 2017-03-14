/**
 * Created by Kyrill on 14.03.2017.
 */

const io = require('socket.io-client');

class SessionClient {
    constructor(name, session)
    {
        this.name = name;
        this.session = session;
        console.log('created sessionClient');
    }

    connect()
    {
        this.socket = io('http://172.20.10.6/');
        this.socket.on('connect', this.onConnect);
        this.socket.on('connect_failed', this.onConnectFailed);
        this.socket.on('error', this.onSocketError);
        this.socket.on('disconnect', this.onDisconnect);
    };

    onConnect()
    {
        console.log('connected');
        this.socket.emit('auth', {name: this.name, session: this.session});
    };

    onDisconnect = () =>
    {
        console.log('disconnected');
    };

    onConnectFailed = () =>
    {
        console.log('connect failed');
    };

    onSocketError = (error) =>
    {
        console.error('socket error: ' +error);
    };
}

export default SessionClient;
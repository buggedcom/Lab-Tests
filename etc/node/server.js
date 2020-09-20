import app from "./app";
import debug0 from "debug";
import http from "http";
import beep from "beepbeep";
import colors from "colors";

// import winston from "winston";

process.env.NODE_ENV = process.env.NODE_ENV || 'production'; // force production if no ENV is found to prevent accidental leakage.
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTesting = process.env.NODE_ENV === 'testing';

let port = 8080;
if(isTesting === true) {
    port = 8082;
}

app.set('port', normalizePort(port));
console.log('Server port configured to ' + port + '.');

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    // named pipe
    if (isNaN(port) === true) {
        return val;
    }

    // port number
    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    console.error(error);

    if(error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch(error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const debug = debug0('node:server');
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = server;
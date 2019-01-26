/*
 * File: app.js
 * Project: future stream
 * Created Date: Saturday January 5th 2019
 * Author: DaGai  <binghan2836@163.com>
 * -----
 * Last Modified: Saturday January 26th 2019 2:10:45 pm
 * Modified By:   the developer formerly known as DaGai
 * -----
 * MIT License
 * 
 * Copyright (c) 2019 binghan2836@163.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * -----
 * HISTORY:
 * Date          By    Comments
 * ----------    ---    ----------------------------------------------------------
 * 2019-01-05    DaGai    
 */


/* eslint-disable no-console */

'use strict';

//var os = require('os');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');
//var crypto = require('crypto');
const https = require('https');
const express = require('express');
const app = express();
const url = require('url');
//const ejs = require('ejs');
var bodyParser = require('body-parser');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


let server;

//config server
//load configure file
let serverConfig;
try {
    let content = fs.readFileSync('./signaling.config', 'utf-8');

    serverConfig = JSON.parse(content);

    //active server
    if (serverConfig['server']['http'] == 'active') {
        console.log('http server active');
    }

    if (serverConfig['server']['https'] == 'active') {
        // Public Self-Signed Certificates for HTTPS connection
        let Path = serverConfig['certifacation']['path'];
        let keyPath = Path + serverConfig['certifacation']['key'];
        let certPath = Path + serverConfig['certifacation']['cert'];
        let privateKey = fs.readFileSync(keyPath, 'utf8');
        let certificate = fs.readFileSync(certPath, 'utf8');

        var credentials = { key: privateKey, cert: certificate };

        server = https.createServer(credentials, app);

    }

    console.log(serverConfig);

} catch (err) {

    console.log(err);
}

server.listen(serverConfig['server']['tls_port'], serverConfig['server']['LANAccess']);

//view engine setting
app.set('views',path.join(__dirname + '/view'));
app.set('view engine','ejs');

// Expose the css and js resources as "public"
app.use('/public', express.static('./source'));

//router
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/chat', function (req, res) {
    var data = url.parse(req.url, true).query;
    res.render('chat',{room:data['room']});
});

// eslint-disable-next-line no-unused-vars
app.post('/room/post_room_name',function(req,res,next){
    console.log(req.body);
    res.redirect('/chat?room=' + req.body['room']);
});

//socket.io
var io = socketIO.listen(server);
io.sockets.on('connection', function (socket) {

    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

    socket.on('message', function (message) {
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
    });

    socket.on('access', function (room) {
        log('Received request to create or join room ' + room);

        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 0) {
            socket.join(room);
            log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('identify', room, socket.id);
        } else if (numClients === 1) {
            log('Client ID ' + socket.id + ' joined room ' + room);
            socket.emit('identify', room, socket.id);
            socket.join(room);
            socket.broadcast.to(room).emit('joined', room, socket.id);
            
            //io.sockets.in(room).emit('joined', room, socket.id);

        } else { // max two clients
            socket.emit('full', room);
        }
    });
});

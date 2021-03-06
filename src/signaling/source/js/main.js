/*
 * File: main.js
 * Project: future stream
 * Created Date: Monday January 7th 2019
 * Author: DaGai  <binghan2836@163.com>
 * -----
 * Last Modified: Saturday January 26th 2019 2:33:10 pm
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
 */
// eslint-disable-next-line no-undef
var socket = io.connect();

var room_name = document.querySelector('#room_name').innerHTML;

document.getElementById('send-message').addEventListener('click', function(){
    // Get the text to send
    var text = document.getElementById('message').value;

    var messageHTML = '<p align="right">'+ text +'</p>';

    document.getElementById('messages').innerHTML += messageHTML;

    document.getElementById('message').value = '';

    socket.emit('message', text);
    /*
    // Prepare the data to send
    var data = {
        from: username,
        text: text
    };

    // Send the message with Peer
    conn.send(data);

    // Handle the message on the UI
    handleMessage(data);
    */
    
}, false);


socket.emit('access', room_name);

socket.on('log', function (array) {
    // eslint-disable-next-line no-console
    console.log.apply(console, array);
});

socket.on('identify', function (room, id) {
    // eslint-disable-next-line no-console
    console.log('identify:' + room + '  ' + id);
});

socket.on('joined', function (room, id) {
    // eslint-disable-next-line no-console
    console.log('join msg: ' + room + '  ' + id);
});

socket.on('message', function (message) {
    // eslint-disable-next-line no-console
    var messageHTML = '<p align="left">'+ message +'</p>';

    document.getElementById('messages').innerHTML += messageHTML;
});

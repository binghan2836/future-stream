/*
 * File: app.js
 * Project: future stream
 * Created Date: Saturday January 5th 2019
 * Author: DaGai  <binghan2836@163.com>
 * -----
 * Last Modified: Monday January 7th 2019 1:24:27 pm
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
let fs = require('fs');
var path   = require('path');
//var crypto = require('crypto');
var https = require('https');
var express = require('express');
var app = express();
var httpsServer;

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

        httpsServer = https.createServer(credentials, app);

    }

    console.log(serverConfig);

} catch (err) {

    console.log(err);
}

httpsServer.listen(serverConfig['server']['tls_port'], serverConfig['server']['LANAccess']);

//router
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});
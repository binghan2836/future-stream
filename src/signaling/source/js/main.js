/*
 * File: main.js
 * Project: future stream
 * Created Date: Monday January 7th 2019
 * Author: DaGai  <binghan2836@163.com>
 * -----
 * Last Modified: Monday January 7th 2019 4:28:52 pm
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

socket.emit('create or join', '12345678');

socket.on('log', function (array) {
    // eslint-disable-next-line no-console
    console.log.apply(console, array);
});
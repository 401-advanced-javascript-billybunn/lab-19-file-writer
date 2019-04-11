'use strict';
/*
This will be a repeat of the previous labs, this time using your new message queue server.

- In the starter code, you'll once again find an app.js that reads and modifies a file.
- On a successful write, publish a "save" event to the "file" queue
- On error, publish an "error" event to the "file" queue
- Modularize the file reader
*/

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const read = (file) => readFile(file);
const write = (file, buffer) => writeFile(file, buffer);
const uppercase = (buffer) => Buffer.from(buffer.toString().trim().toUpperCase());

const alterFile = (file) => {
  read(file)
    .then(buffer => uppercase(buffer))
    .then(buffer => write(file, buffer))
    .then(success => {
      let payload = {
        status: 1,
        file: file,
        text: 'saved properly',
      };
      socket.emit('file-save', payload);
    })

    .catch(error => {
      let payload = {
        status: 0, 
        file: file, 
        text: error.message,
      };
      socket.emit('file-error', payload);
    });

};

let file = process.argv.slice(2).shift();
alterFile(file);

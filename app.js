'use strict';

const Q = require('@nmq/q/client');

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
      Q.publish('file', 'save', payload);
    })

    .catch(error => {
      let payload = {
        status: 0, 
        file: file, 
        text: error.message,
      };
      Q.publish('file', 'error', payload);
    });

};

let file = process.argv.slice(2).shift();
alterFile(file);

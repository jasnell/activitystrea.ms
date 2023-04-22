'use strict';

const { Transform } = require('readable-stream');
const as = require('./activitystreams');
const ctx = require('activitystreams-context');
const buf = Symbol('buffer');

class AS2Stream extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this[buf] = '';
  }

  _transform(chunk, encoding, callback) {
    this[buf] += chunk.toString('utf8');
    callback();
  }

  _flush(callback) {
    try {
      const res = JSON.parse(this[buf]);
      this[buf] = '';
      res['@context'] = res['@context'] || ctx;
      as.import(res).then((obj) => {
        this.push(obj);
        callback();
      }, callback);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = AS2Stream;

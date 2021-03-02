'use strict';

const Writable = require('readable-stream').Writable;
const as = require('./activitystreams');

class AS2Writer extends Writable {
  constructor(req) {
    super({objectMode: true});
    this.req = req;
  }

  _write(chunk, encoding, callback) {
    this.req.body = chunk;
    callback();
  }
}

function as2middleware(req, res, next) {
  function error() {
    res.status(400).end('Could not successfully parse payload');
  }
  if (req.body) {
    next(); // already parsed
    return;
  }
  if (req.is('application/json') || req.is('application/*+json')) {
    const str = new as.Stream();
    req.pipe(str)
       .on('end', () => next())
       .on('error', error)
       .pipe(new AS2Writer(req))
       .on('error', error);
  } else {
    next(); // nothing to do
  }
}

module.exports = as2middleware;

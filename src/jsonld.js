'use strict';

const jsonld = require('jsonld')();
const jsig = require('jsonld-signatures');
const checkCallback = require('./utils').checkCallback;
const as_context = require('activitystreams-context');
const ext_context = require('./extcontext');
const models = require('./models');
const Environment = require('./environment');
const Loader = require('./contextloader');
const as_url_nohash = 'https://www.w3.org/ns/activitystreams';

var warned = false;
function warn() {
  if (!warned) {
    const warnfn = typeof process.emitWarning === 'function' ?
        process.emitWarning : console.warn;
    warnfn(
      'Warning: JSON-LD Signatures are still experimental. ' +
      'Use in production environments is not recommended');
    warned = true;
  }
}

jsonld.documentLoader = (new Loader()).makeDocLoader();

function getContext(options) {
  if (options.useOriginalContext && options.origContext) {
    return {'@context': options.origContext};
  } else {
    let ctx = [];
    const ext = ext_context.get();
    if (ext)
      ctx = ctx.concat(ext);
    if (options && options.sign)
      ctx.push(jsig.SECURITY_CONTEXT_URL);
    if (options && options.additional_context)
      ctx.push(options.additional_context);
    ctx.push(as_url_nohash);
    return {'@context': ctx.length > 1 ? ctx : ctx[0]};
  }
}

class JsonLD {

  static normalize(expanded, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    checkCallback(callback);
    jsonld.normalize(
      expanded,
      {format: 'application/nquads'},
      (err, doc) => {
        if (err) return callback(err);
        callback(null, doc);
      });
  }

  static compact(expanded, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    checkCallback(callback);
    const _context = getContext(options);
    jsonld.compact(
      expanded, _context, {},
      (err, doc) => {
        if (err) return callback(err);
        if (typeof options.sign === 'object') {
          warn();
          jsig.sign(doc, options.sign, callback);
        } else {
          callback(null, doc);
        }
      });
  }

  static verify(input, options, callback) {
    warn();
    if (typeof input === 'string')
      input = JSON.parse(input);
    checkCallback(callback);
    jsig.verify(input, options, callback);
  }

  static import(input, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    checkCallback(callback);
    let environment = options.environment || new Environment(input);
    if (!(environment instanceof Environment))
      environment = new Environment(input);
    environment.applyAssumedContext(input);
    jsonld.expand(
      input, {
        expandContext: as_context,
        documentLoader: environment.loader.makeDocLoader(),
        keepFreeFloatingNodes: true
      },
      (err, expanded) => {
        if (err) return callback(err);
        if (expanded && expanded.length > 0) {
          const object = models.wrap_object(expanded[0], environment);
          callback(null, object);
        } else {
          callback(null, null);
        }
      }
    );
  }

  static importFromRDF(input, callback) {
    checkCallback(callback);
    jsonld.fromRDF(input, {format: 'application/nquads'},
    (err, expanded) => {
      if (err) return callback(err);
      const base = models.wrap_object(expanded[0]);
      callback(null, base);
    });
  }
}

module.exports = JsonLD;

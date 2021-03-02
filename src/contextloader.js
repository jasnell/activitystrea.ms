'use strict';

const jsonld = require('jsonld')();
const checkCallback = require('./utils').checkCallback;
const as = require('vocabs-as');
const as_context = require('activitystreams-context');
const securityContext = require('./jsig');

const jsig_url = 'https://w3id.org/security/v1';
const as_url_nohash = 'https://www.w3.org/ns/activitystreams';
const default_doc_loader = jsonld.documentLoaders.node();
const _map = Symbol('map');

/**
 * Creates a custom JSON-LD document loader using an internal map of
 * context objects
 **/
class Loader {
  constructor() {
    this[_map] = Object.create(null);
    this.register(as.ns, as_context);
    this.register(as_url_nohash, as_context);
    this.register(jsig_url, securityContext);
  }
  
  register(url, context) {
    this[_map][url] = context;
    return this;
  }
  
  get(url) {
    return this[_map][url];
  }
  
  makeDocLoader() {
    return (url, cb) => {
      checkCallback(cb);
      const context = this[_map][url];
      if (context) {
        return cb(null, {
          contextUrl: null,
          document: context,
          documentUrl: url
        });
      } else {
        default_doc_loader(url, cb);
      }
    };
  }
}

Loader.defaultInstance = new Loader();

module.exports = Loader;

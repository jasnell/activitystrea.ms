'use strict';

const jsonld = require('jsonld')();
const jsig = require('jsonld-signatures');
const as_context = require('activitystreams-context');
const ext_context = require('./extcontext');
const models = require('./models');
const Environment = require('./environment');
const Loader = require('./contextloader');
const as_url_nohash = 'https://www.w3.org/ns/activitystreams';

jsonld.documentLoader = Loader.defaultInstance.makeDocLoader();

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

  static async normalize(expanded, options = {}) {
    return jsonld.canonize(expanded, {
      format: 'application/nquads',
      ...options
    });
  }

  static async compact(expanded, options = {}) {
    const _context = getContext(options);
    const doc = await jsonld.compact(
      expanded, _context, {}
    );

    if (typeof options.sign === 'object') {
      return jsig.sign(doc, {
        documentLoader: jsonld.documentLoader,
        ...options.sign
      });
    }

    return doc;
  }

  static async verify(input, options = {}) {
    if (typeof input === 'string') {
      input = JSON.parse(input);
    }
    return jsig.verify(input, options);
  }

  static async import(input, options = {}) {
    let environment = options.environment || new Environment(input);
    if (!(environment instanceof Environment)) {
      environment = new Environment(input);
    }
    environment.applyAssumedContext(input);
    const expanded = await jsonld.expand(input, {
      expandContext: as_context,
      documentLoader: environment.loader.makeDocLoader(),
      keepFreeFloatingNodes: true
    });

    if (expanded && expanded.length > 0) {
      return models.wrap_object(expanded[0], environment);
    }

    return null;
  }

  static async importFromRDF(input) {
    const expanded = await jsonld.fromRDF(input, {format: 'application/nquads'});
    return models.wrap_object(expanded[0]);
  }
}

module.exports = JsonLD;

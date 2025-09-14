'use strict';

const reasoner = require('./reasoner');
const jsonld = require('./jsonld');
const Loader = require('./contextloader');
const ext_context = require('./extcontext');
const as = require('vocabs-as');
const models = require('./models');

function _types(types, additional) {
  types = types || [];
  if (!Array.isArray(types))
    types = [types];
  if (additional) {
    if (!Array.isArray(additional))
      additional = [additional];
    types = types.concat(additional);
  }
  return types;
}

class AS2 {

  static use(extension) {
    if (extension && typeof extension.init === 'function')
      extension.init(models, reasoner, ext_context);
  }

  static registerContext (url, context) {
    Loader.defaultInstance.register(url, context);
  }

  static langmap() {
    return new models.LanguageValue.Builder();
  }

  static object(types, environment) {
    return new models.Object.Builder(
      _types(types), undefined, environment);
  }

  static activity(types, environment) {
    return AS2.object(_types(types, as.Activity), environment);
  }

  static collection(types, environment) {
    return AS2.object(_types(types, as.Collection), environment);
  }

  static orderedCollection(types, environment) {
    return AS2.object(_types(types, as.OrderedCollection), environment);
  }

  static collectionPage(types, environment) {
    return AS2.object(_types(types, as.CollectionPage), environment);
  }

  static orderedCollectionPage(types, environment) {
    return AS2.object(_types(types, as.OrderedCollectionPage), environment);
  }

  static link(types, environment) {
    return new models.Link.Builder(
      _types(types), undefined, environment);
  }

  static accept(types, environment) {
    return AS2.object(_types(types, as.Accept), environment);
  }

  static tentativeAccept(types, environment) {
    return AS2.object(_types(types, as.TentativeAccept), environment);
  }

  static add(types, environment) {
    return AS2.object(_types(types, as.Add), environment);
  }

  static arrive(types, environment) {
    return AS2.object(_types(types, as.Arrive), environment);
  }

  static create(types, environment) {
    return AS2.object(_types(types, as.Create), environment);
  }

  static delete(types, environment) {
    return AS2.object(_types(types, as.Delete), environment);
  }

  static follow(types, environment) {
    return AS2.object(_types(types, as.Follow), environment);
  }

  static ignore(types, environment) {
    return AS2.object(_types(types, as.Ignore), environment);
  }

  static join(types, environment) {
    return AS2.object(_types(types, as.Join), environment);
  }

  static leave(types, environment) {
    return AS2.object(_types(types, as.Leave), environment);
  }

  static like(types, environment) {
    return AS2.object(_types(types, as.Like), environment);
  }

  static offer(types, environment) {
    return AS2.object(_types(types, as.Offer), environment);
  }

  static invite(types, environment) {
    return AS2.object(_types(types, as.Invite), environment);
  }

  static reject(types, environment) {
    return AS2.object(_types(types, as.Reject), environment);
  }

  static tentativeReject(types, environment) {
    return AS2.object(_types(types, as.TentativeReject), environment);
  }

  static remove(types, environment) {
    return AS2.object(_types(types, as.Remove), environment);
  }

  static undo(types, environment) {
    return AS2.object(_types(types, as.Undo), environment);
  }

  static update(types, environment) {
    return AS2.object(_types(types, as.Update), environment);
  }

  static view(types, environment) {
    return AS2.object(_types(types, as.View), environment);
  }

  static listen(types, environment) {
    return AS2.object(_types(types, as.Listen), environment);
  }

  static read(types, environment) {
    return AS2.object(_types(types, as.Read), environment);
  }

  static move(types, environment) {
    return AS2.object(_types(types, as.Move), environment);
  }

  static travel(types, environment) {
    return AS2.object(_types(types, as.Travel), environment);
  }

  static announce(types, environment) {
    return AS2.object(_types(types, as.Announce), environment);
  }

  static block(types, environment) {
    return AS2.object(_types(types, as.Block), environment);
  }

  static flag(types, environment) {
    return AS2.object(_types(types, as.Flag), environment);
  }

  static dislike(types, environment) {
    return AS2.object(_types(types, as.Dislike), environment);
  }

  static application(types, environment) {
    return AS2.object(_types(types, as.Application), environment);
  }

  static group(types, environment) {
    return AS2.object(_types(types, as.Group), environment);
  }

  static person(types, environment) {
    return AS2.object(_types(types, as.Person), environment);
  }

  static service(types, environment) {
    return AS2.object(_types(types, as.Service), environment);
  }

  static organization(types, environment) {
    return AS2.object(_types(types, as.Organization), environment);
  }

  static article(types, environment) {
    return AS2.object(_types(types, as.Article), environment);
  }

  static document(types, environment) {
    return AS2.object(_types(types, as.Document), environment);
  }

  static audio(types, environment) {
    return AS2.object(_types(types, as.Audio), environment);
  }

  static image(types, environment) {
    return AS2.object(_types(types, as.Image), environment);
  }

  static video(types, environment) {
    return AS2.object(_types(types, as.Video), environment);
  }

  static note(types, environment) {
    return AS2.object(_types(types, as.Note), environment);
  }

  static page(types, environment) {
    return AS2.object(_types(types, as.Page), environment);
  }

  static question(types, environment) {
    return AS2.object(_types(types, as.Question), environment);
  }

  static tombstone(types, environment) {
    return AS2.object(_types(types, as.Tombstone), environment);
  }

  static event(types, environment) {
    return AS2.object(_types(types, as.Event), environment);
  }

  static relationship(types, environment) {
    return AS2.object(_types(types, as.Relationship), environment);
  }

  static profile(types, environment) {
    return AS2.object(_types(types, as.Profile), environment);
  }

  static place(types, environment) {
    return AS2.object(_types(types, as.Place), environment);
  }

  static mention(types, environment) {
    return AS2.link(_types(types, as.Mention), environment);
  }

  static get interval() {
    const interval = require('./interval');
    Object.defineProperty(AS2, 'interval', {
      configurable: false,
      enumerable: true,
      value: interval
    });
    return interval;
  }

  static get social() {
    const social = require('./social');
    Object.defineProperty(AS2, 'social', {
      configurable: false,
      enumerable: true,
      value: social
    });
    return social;
  }

  static get Stream() {
    const stream = require('./stream');
    Object.defineProperty(this, 'Stream', {
      enumerable: true,
      configurable: false,
      value: stream
    });
    return stream;
  }

  static get Middleware() {
    const middle = require('./middle');
    Object.defineProperty(this, 'Middleware', {
      enumerable: true,
      configurable: false,
      value: middle
    });
    return middle;
  }

}

Object.defineProperties(AS2, {
  mediaType: {
    enumerable: true,
    configurable: false,
    value: 'application/activity+json'
  },
  verify: {
    enumerable: true,
    configurable: false,
    value: jsonld.verify
  },
  import: {
    enumerable: true,
    configurable: false,
    value: jsonld.import
  },
  importFromRDF: {
    enumerable: true,
    configurable: false,
    value: jsonld.importFromRDF
  },
  models: {
    enumerable: true,
    configurable: false,
    value: models
  }
});

module.exports = AS2;

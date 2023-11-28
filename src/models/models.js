'use strict';

const as = require('vocabs-as');
const reasoner = require('../reasoner');
const _compose = Symbol('compose');

var cache = Object.create(null);

function core_recognizer(type) {
  let thing;
  const node = reasoner.node(type);
  if (node.is(as.OrderedCollectionPage)) {
    thing = exports.OrderedCollectionPage;
  } else if (node.is(as.CollectionPage)) {
    thing = exports.CollectionPage;
  } else if (node.is(as.OrderedCollection)) {
    thing = exports.OrderedCollection;
  } else if (node.is(as.Collection)) {
    thing = exports.Collection;
  } else if (node.is(as.Question)) {
    thing = exports.Question;
  } else if (node.is(as.Activity)) {
    thing = exports.Activity;
  } else if (node.is(as.Profile)) {
    thing = exports.Profile;
  } else if (node.is(as.Place)) {
    thing = exports.Place;
  } else if (node.is(as.Relationship)) {
    thing = exports.Relationship;
  } else if (node.is(as.Tombstone)) {
    thing = exports.Tombstone;
  }
  return thing;
}

var recognizers = [core_recognizer];

function recognize(type) {
  let thing = cache[type];
  if (thing !== undefined) return thing;
  for (const recognizer of recognizers) {
    thing = recognizer(type);
    if (thing !== undefined) {
      cache[type] = thing;
      return thing;
    }
  }
  return undefined;
}

module.exports = exports = {

  get LanguageValue() {
    const lv = require('./_languagevalue');
    Object.defineProperty(this, 'LanguageValue', {
      enumerable: true,
      configurable: false,
      value: lv
    });
    return lv;
  },

  get Base() {
    const base = require('./_base');
    Object.defineProperty(this, 'Base', {
      enumerable: true,
      configurable: false,
      value: base
    });
    return base;
  },

  get Object() {
    const obj = require('./_object');
    Object.defineProperty(this, 'Object', {
      enumerable: true,
      configurable: false,
      value: obj
    });
    return obj;
  },

  get Activity() {
    const activity = require('./_activity');
    Object.defineProperty(this, 'Activity', {
      enumerable: true,
      configurable: false,
      value: activity
    });
    return activity;
  },

  get Collection() {
    const col = require('./_collection');
    Object.defineProperty(this, 'Collection', {
      enumerable: true,
      configurable: false,
      value: col
    });
    return col;
  },

  get OrderedCollection() {
    const col = require('./_orderedcollection');
    Object.defineProperty(this, 'OrderedCollection', {
      enumerable: true,
      configurable: false,
      value: col
    });
    return col;
  },

  get CollectionPage() {
    const page = require('./_collectionpage');
    Object.defineProperty(this, 'CollectionPage', {
      enumerable: true,
      configurable: false,
      value: page
    });
    return page;
  },

  get OrderedCollectionPage() {
    const page = require('./_orderedcollectionpage');
    Object.defineProperty(this, 'OrderedCollectionPage', {
      enumerable: true,
      configurable: false,
      value: page
    });
    return page;
  },

  get Link() {
    const link = require('./_link');
    Object.defineProperty(this, 'Link', {
      enumerable: true,
      configurable: false,
      value: link
    });
    return link;
  },

  get Place() {
    const place = require('./_place');
    Object.defineProperty(this, 'Place', {
      enumerable: true,
      configurable: false,
      value: place
    });
    return place;
  },

  get Relationship() {
    const rel = require('./_relationship');
    Object.defineProperty(this, 'Relationship', {
      enumerable: true,
      configurable: false,
      value: rel
    });
    return rel;
  },

  get Profile() {
    const profile = require('./_profile');
    Object.defineProperty(this, 'Profile', {
      enumerable: true,
      configurable: false,
      value: profile
    });
    return profile;
  },

  get Question() {
    const question = require('./_question');
    Object.defineProperty(this, 'Question', {
      enumerable: true,
      configurable: false,
      value: question
    });
    return question;
  },
  
  get Tombstone() {
    const tombstone = require('./_tombstone');
    Object.defineProperty(this, 'Tombstone', {
      enumerable: true,
      configurable: false,
      value: tombstone
    });
    return tombstone;
  },
  
  get compose() {
    return _compose;
  },

  compose_builder(builder, types) {
    types = reasoner.reduce(types || []);
    for (const type of types) {
      const Thing = recognize(type);
      if (Thing)
        builder[_compose](Thing.Builder);
    }
  },
  
  compose_base(base, types) {
    types = reasoner.reduce(types || []);
    for (const type of types) {
      const Thing = recognize(type);
      if (Thing)
        base[_compose](Thing);
    }
  },

  wrap_object(expanded, environment) {
    const types = reasoner.reduce(expanded['@type'] || []);
    var is_link = false;
    for (const type of types) {
      const nodetype = reasoner.node(type);
      if (nodetype.is(as.Link)) {
        is_link = true;
        break;
      }
    }
    const Thing = is_link ?
      exports.Link :
      exports.Object;
    return new Thing(expanded, undefined, environment);
  },

  use(recognizer) {
    if (typeof recognizer !== 'function')
      throw new Error('Recognizer must be a function');
    recognizers = [recognizer].concat(recognizers);
    cache = Object.create(null);
  }
};

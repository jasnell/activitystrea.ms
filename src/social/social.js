'use strict';

const a = require('../activitystreams');
const reasoner = require('../reasoner');
const social = require('vocabs-social');
const owl = require('vocabs-owl');
const rdf = require('vocabs-rdf');
const as = require('vocabs-as');
const rdfs = require('vocabs-rdfs');

exports.model = {
  get Population() {
    const ret = require('./_population');
    Object.defineProperty(this, 'Population', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  },
  get Interested() {
    const ret = require('./_interested');
    Object.defineProperty(this, 'Interested', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  },
  get Everyone() {
    const ret = require('./_everyone');
    Object.defineProperty(this, 'Everyone', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  },
  get CompoundPopulation() {
    const ret = require('./_compoundpopulation');
    Object.defineProperty(this, 'CompoundPopulation', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  },
  get Common() {
    const ret = require('./_common');
    Object.defineProperty(this, 'Common', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  }
};

function gettypes(types, type) {
  return (types || []).concat([type]);
}

exports.population = function(types, environment) {
  return a.object(gettypes(types, social.Population), environment);
};
exports.everyone = function(types, environment) {
  return a.object(gettypes(types, social.Everyone), environment);
};
exports.public = function(types, environment) {
  return a.object(gettypes(types, social.Public), environment);
};
exports.private = function(types, environment) {
  return a.object(gettypes(types, social.Private), environment);
};
exports.direct = function(types, environment) {
  return a.object(gettypes(types, social.Direct), environment);
};
exports.common = function(types, environment) {
  return a.object(gettypes(types, social.Common), environment);
};
exports.interested = function(types, environment) {
  return a.object(gettypes(types, social.Interested), environment);
};
exports.self = function(types, environment) {
  return a.object(gettypes(types, social.Self), environment);
};
exports.all = function(types, environment) {
  return a.object(gettypes(types, social.All), environment);
};
exports.any = function(types, environment) {
  return a.object(gettypes(types, social.Any), environment);
};
exports.none = function(types, environment) {
  return a.object(gettypes(types, social.None), environment);
};
exports.compoundPopulation = function(types, environment) {
  return a.object(gettypes(types, social.CompoundPopulation), environment);
};

function social_recognizer(type) {
  let Thing;
  if (type) {
    const node = reasoner.node(type);
    if (node.is(social.Common)) {
      Thing = exports.model.Common;
    } else if (node.is(social.Interested)) {
      Thing = exports.model.Interested;
    } else if (node.is(social.CompoundPopulation)) {
      Thing = exports.model.CompoundPopulation;
    } else if (node.is(social.Everyone)) {
      Thing = exports.model.Everyone;
    } else if (node.is(social.Population)) {
      Thing = exports.model.Population;
    }
  }
  return Thing;
}

exports.init = function(models, reasoner, context) {

  context.add({
    soc: 'http://ns.jasnell.me/social#',
    havingDimension: {
      '@id': 'soc:havingDimension',
      '@type': '@id'
    },
    havingRole: {
      '@id': 'soc:havingRole',
      '@type': '@id'
    },
    havingRelationship: {
      '@id': 'soc:havingRelationship',
      '@type': '@id'
    },
    distance: {
      '@id': 'soc:distance'
    },
    confidence: {
      '@id': 'soc:confidence'
    }
  });

  models.use(social_recognizer);

  const graph = new reasoner.Graph();
  [
    [social.Population, as.Object],
    [social.Everyone, social.Population],
    [social.Public, social.Population],
    [social.Private, social.Population],
    [social.Direct, social.Population],
    [social.Common, social.Population],
    [social.Interested, social.Population],
    [social.Self, social.Population],
    [social.All, social.CompoundPopulation],
    [social.Any, social.CompoundPopulation],
    [social.None, social.CompoundPopulation],
    [social.CompoundPopulation, social.Population]
  ].forEach((pair) => {
    graph.add({
      subject: pair[0],
      predicate: rdfs.subClassOf,
      object: pair[1]
    });
  });

  const functionalDatatype = [
        owl.DatatypeProperty,
        owl.FunctionalProperty
      ];
  [
    [social.member, owl.ObjectProperty],
    [social.confidence, functionalDatatype],
    [social.havingDimension, owl.ObjectProperty],
    [social.havingRole, owl.ObjectProperty],
    [social.havingRelationship, owl.ObjectProperty],
    [social.distance, functionalDatatype]
  ].forEach((pair) => {
    graph.add({
      subject: pair[0],
      predicate: rdf.type,
      object: pair[1]
    });
  });

  reasoner.bind(graph);
};

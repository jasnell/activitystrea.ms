'use strict';

const a = require('../activitystreams');
const reasoner = require('../reasoner');
const Interval = require('./_model');
const interval = require('vocabs-interval');
const as = require('vocabs-as');
const owl = require('vocabs-owl');
const rdf = require('vocabs-rdf');
const rdfs = require('vocabs-rdfs');

module.exports = exports = function(types) {
  return new Interval.Builder(types);
};

module.exports.model = {
  Interval: Interval
};

function gettypes(types, type) {
  return (types || []).concat([type]);
}

exports.open = function(types, environment) {
  return a.object(gettypes(types, interval.OpenInterval), environment);
};
exports.closed = function(types, environment) {
  return a.object(gettypes(types, interval.ClosedInterval), environment);
};
exports.openClosed = function(types, environment) {
  return a.object(gettypes(types, interval.OpenClosedInterval), environment);
};
exports.closedOpen = function(types, environment) {
  return a.object(gettypes(types, interval.ClosedOpenInterval), environment);
};
exports.leftOpen = function(types, environment) {
  return a.object(gettypes(types, interval.LeftOpenInterval), environment);
};
exports.rightOpen = function(types, environment) {
  return a.object(gettypes(types, interval.RightOpenInterval), environment);
};
exports.leftClosed = function(types, environment) {
  return a.object(gettypes(types, interval.LeftClosedInterval), environment);
};
exports.rightClosed = function(types, environment) {
  return a.object(gettypes(types, interval.RightClosedInterval), environment);
};

function interval_recognizer(type) {
  let thing;
  if (type && reasoner.node(type).is(interval.Interval)) {
    thing = Interval;
  }
  return thing;
}

exports.init = function(models, reasoner, context) {

  context.add({
    i: 'http://ns.jasnell.me/interval#'
  });

  models.use(interval_recognizer);

  const graph = new reasoner.Graph();
  [
    [interval.Interval, as.Object],
    [interval.OpenInterval, interval.Interval],
    [interval.ClosedInterval, interval.Interval],
    [interval.OpenClosedInterval, interval.Interval],
    [interval.ClosedOpenInterval, interval.Interval],
    [interval.LeftOpenInterval, interval.Interval],
    [interval.RightOpenInterval, interval.Interval],
    [interval.LeftClosedInterval, interval.Interval],
    [interval.RightClosedInterval, interval.Interval]
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
      ],
      functionalObject = [
        owl.ObjectProperty,
        owl.FunctionalProperty
      ];

  [
    [interval.indexRange, functionalObject],
    [interval.publishedRange, functionalObject],
    [interval.startTimeRange, functionalObject],
    [interval.lower, functionalDatatype],
    [interval.upper, functionalDatatype],
    [interval.step, functionalDatatype],
  ].forEach((pair) => {
    graph.add({
      subject: pair[0],
      predicate: rdf.type,
      object: pair[1]
    });
  });

  reasoner.bind(graph);

};

'use strict';

const Base = require('./_base');
const composedType = Base.composedType;
const as = require('vocabs-as');

const Activity = composedType(undefined, {
  get actor() {
    const actor = this.get(as.actor);
    Object.defineProperty(this, 'actor', {
      enumerable: true,
      configurable: false,
      value: actor
    });
    return actor;
  },
  get object() {
    const obj = this.get(as.object);
    Object.defineProperty(this, 'object', {
      enumerable: true,
      configurable: false,
      value: obj
    });
    return obj;
  },
  get target() {
    const target = this.get(as.target);
    Object.defineProperty(this, 'target', {
      enumerable: true,
      configurable: false,
      value: target
    });
    return target;
  },
  get result() {
    const result = this.get(as.result);
    Object.defineProperty(this, 'result', {
      enumerable: true,
      configurable: false,
      value: result
    });
    return result;
  },
  get origin() {
    const origin = this.get(as.origin);
    Object.defineProperty(this, 'origin', {
      enumerable: true,
      configurable: false,
      value: origin
    });
    return origin;
  },
  get instrument() {
    const instrument = this.get(as.instrument);
    Object.defineProperty(this, 'instrument', {
      enumerable: true,
      configurable: false,
      value: instrument
    });
    return instrument;
  }
});

const ActivityBuilder = composedType(undefined, {
  actor(val) {
    this.set(as.actor, val);
    return this;
  },
  object(val) {
    this.set(as.object, val);
    return this;
  },
  target(val) {
    this.set(as.target, val);
    return this;
  },
  result(val) {
    this.set(as.result, val);
    return this;
  },
  origin(val) {
    this.set(as.origin, val);
    return this;
  },
  instrument(val) {
    this.set(as.instrument, val);
    return this;
  }
});

Activity.Builder = ActivityBuilder;

module.exports = Activity;

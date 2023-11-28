'use strict';

const Base = require('../models').Base;
const composedType = Base.composedType;
const Population = require('./_population');
const utils = require('../utils');
const throwif = utils.throwif;
const is_integer = utils.is_integer;
const range = utils.range;
const social = require('vocabs-social');

const Interested = composedType(Population, {
  get confidence() {
    const ret = range(0, 100, this.get(social.confidence));
    Object.defineProperty(this, 'confidence', {
      enumerable: true,
      configurable: false,
      value: isNaN(ret) ? undefined : ret
    });
    return isNaN(ret) ? undefined : ret;
  }
});

const InterestedBuilder = composedType(Population.Builder, {
  confidence(val) {
    throwif(
      !is_integer(val),
      'confidence must be an integer between 0 and 100'
    );
    this.set(social.confidence, range(0, 100, val));
    return this;
  }
});
Interested.Builder = InterestedBuilder;

module.exports = Interested;

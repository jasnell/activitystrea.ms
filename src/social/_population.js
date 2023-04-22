'use strict';

const Base = require('../models').Base;
const composedType = Base.composedType;
const utils = require('../utils');
const range = utils.range;
const social = require('vocabs-social');

const Population = composedType(undefined, {
  get distance() {
    const ret = range(0, Infinity, this.get(social.distance));
    Object.defineProperty(this, 'distance', {
      enumerable: true,
      configurable: false,
      value: isNaN(ret) ? undefined : ret
    });
    return isNaN(ret) ? undefined : ret;
  }
});

const PopulationBuilder = composedType(undefined, {
  distance(val) {
    this.set(
      social.distance,
      range(0, Infinity, val)
    );
    return this;
  }
});
Population.Builder = PopulationBuilder;

module.exports = Population;

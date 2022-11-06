const Base = require('../models').Base;
const composedType = Base.composedType;
const Population = require('./_population');
const social = require('vocabs-social');

const CompoundPopulation = composedType(Population, {
  get member() {
    const ret = this.get(social.member);
    Object.defineProperty(this, 'member', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  }
});

const CompoundPopulationBuilder = composedType(Population.Builder, {
  member(val) {
    this.set(social.member, val);
    return this;
  }
});
CompoundPopulation.Builder = CompoundPopulationBuilder;

module.exports = CompoundPopulation;

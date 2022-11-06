const Base = require('../models').Base;
const composedType = Base.composedType;
const Population = require('./_population');
const social = require('vocabs-social');

const Everyone = composedType(Population, {
  get havingRelationship() {
    const ret = this.get(social.havingRelationship);
    Object.defineProperty(this, 'havingRelationship', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  },
  get havingRole() {
    const ret = this.get(social.havingRole);
    Object.defineProperty(this, 'havingRole', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  }
});

const EveryoneBuilder = composedType(Population.Builder, {
  havingRelationship(val) {
    this.set(social.havingRelationship, val);
    return this;
  },
  havingRole(val) {
    this.set(social.havingRole, val);
    return this;
  }
});
Everyone.Builder = EveryoneBuilder;

module.exports = Everyone;

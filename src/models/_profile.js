'use strict';

const as = require('vocabs-as');
const Base = require('./_base');
const composedType = Base.composedType;

const Profile = composedType(undefined, {
  get describes() {
    const describes = this.get(as.describes);
    Object.defineProperty(this, 'describes', {
      enumerable: true,
      configurable: false,
      value: describes
    });
    return describes;
  }
});

const ProfileBuilder = composedType(undefined, {
  describes(val) {
    return this.set(as.describes, val);
  }
});

Profile.Builder = ProfileBuilder;

module.exports = Profile;

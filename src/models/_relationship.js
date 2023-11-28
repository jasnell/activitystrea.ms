'use strict';

const Base = require('./_base');
const composedType = Base.composedType;
const as = require('vocabs-as');

const Relationship = composedType(undefined, {
  get subject() {
    const subject = this.get(as.subject);
    Object.defineProperty(this, 'subject', {
      enumerable: true,
      configurable: false,
      value: subject
    });
    return subject;
  },
  get object() {
    const object = this.get(as.object);
    Object.defineProperty(this, 'object', {
      enumerable: true,
      configurable: false,
      value: object
    });
    return object
  },
  get relationship() {
    const relationship = this.get(as.relationship);
    Object.defineProperty(this, 'relationship', {
      enumerable: true,
      configurable: false,
      value: relationship
    });
    return relationship;
  }
});

const RelationshipBuilder = composedType(undefined, {
  subject(val) {
    return this.set(as.subject, val);
  },
  object(val) {
    return this.set(as.object, val);
  },
  relationship(val) {
    return this.set(as.relationship, val);
  }
});
Relationship.Builder = RelationshipBuilder;

module.exports = Relationship;

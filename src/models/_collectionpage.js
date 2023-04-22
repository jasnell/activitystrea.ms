'use strict';

const as = require('vocabs-as');
const Collection = require('./_collection');
const Base = require('./_base');
const composedType = Base.composedType;

const CollectionPage = composedType(Collection, {
  get partOf() {
    const partOf = this.get(as.partOf);
    Object.defineProperty(this, 'partOf', {
      enumerable: true,
      configurable: false,
      value: partOf
    });
    return partOf;
  },
  get next() {
    const next = this.get(as.next);
    Object.defineProperty(this, 'next', {
      enumerable: true,
      configurable: false,
      value: next
    });
    return next;
  },
  get prev() {
    const prev = this.get(as.prev);
    Object.defineProperty(this, 'prev', {
      enumerable: true,
      configurable: false,
      value: prev
    });
    return prev;
  }
});

const CollectionPageBuilder = composedType(Collection.Builder, {
  partOf(val) {
    return this.set(as.partOf, val);
  },
  next(val) {
    return this.set(as.next, val);
  },
  prev(val) {
    return this.set(as.prev, val);
  }
});

CollectionPage.Builder = CollectionPageBuilder;

module.exports = CollectionPage;

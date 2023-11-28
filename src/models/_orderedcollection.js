'use strict';

const Collection = require('./_collection');
const Base = require('./_base');
const composedType = Base.composedType;

const OrderedCollection = composedType(Collection, {});

const OrderedCollectionBuilder = composedType(Collection.Builder, {
  items() {
    return this.orderedItems.apply(this, arguments);
  }
});

OrderedCollection.Builder = OrderedCollectionBuilder;

module.exports = OrderedCollection;

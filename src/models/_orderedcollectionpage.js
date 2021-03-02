'use strict';

const as = require('vocabs-as');
const xsd = require('vocabs-xsd');
const range = require('../utils').range;
const CollectionPage = require('./_collectionpage');
const OrderedCollection = require('./_orderedcollection');
const Base = require('./_base');
const composedType = Base.composedType;

const OrderedCollectionPage =
  composedType([OrderedCollection, CollectionPage],
  {
    get startIndex() {
      const ret = Math.max(0, this.get(as.startIndex));
      Object.defineProperty(this, 'startIndex', {
        enumerable: true,
        configurable: false,
        value: isNaN(ret) ? 0 : ret
      });
      return isNaN(ret) ? 0 : ret;
    }
  });

const OrderedCollectionPageBuilder =
  composedType([OrderedCollection.Builder, CollectionPage.Builder],
  {
    startIndex(val) {
      this.set(
        as.startIndex,
        range(0, Infinity, val),
        {type: xsd.nonNegativeInteger});
      return this;
    },
    items() {
      return this.orderedItems.apply(this, arguments);
    }
  });
OrderedCollectionPage.Builder = OrderedCollectionPageBuilder;

module.exports = OrderedCollectionPage;

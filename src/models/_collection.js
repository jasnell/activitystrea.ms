'use strict';

const range = require('../utils').range;
const throwif = require('../utils').throwif;
const Base = require('./_base');
const as = require('vocabs-as');
const xsd = require('vocabs-xsd');
const composedType = Base.composedType;
const _ordered = Symbol('ordered');
const _items = Symbol('items');
const slice = Array.prototype.slice;

const Collection = composedType(undefined, {
  get totalItems() {
    const ret = range(0, Infinity, this.get(as.totalItems));
    Object.defineProperty(this, 'totalItems', {
      enumerable: true,
      configurable: false,
      value: isNaN(ret) ? 0 : ret
    });
    return isNaN(ret) ? 0 : ret;
  },
  get current() {
    const current = this.get(as.current);
    Object.defineProperty(this, 'current', {
      enumerable: true,
      configurable: false,
      value: current
    });
    return current;
  },
  get last() {
    const last = this.get(as.last);
    Object.defineProperty(this, 'last', {
      enumerable: true,
      configurable: false,
      value: last
    });
    return last;
  },
  get first() {
    const first = this.get(as.first);
    Object.defineProperty(this, 'first', {
      enumerable: true,
      configurable: false,
      value: first
    });
    return first;
  },
  get items() {
    const val = this.get(as.items);
    const items = !val ?
            undefined :
            Array.isArray(val) && Array.isArray(val[0]) ? val[0] : val; 
    Object.defineProperty(this, 'items', {
      enumerable: true,
      configurable: false,
      value: items
    });
    return items;
  }
});

const CollectionBuilder = composedType(undefined, {
  totalItems(val) {
    this.set(
      as.totalItems,
      range(0, Infinity, val),
      {type: xsd.nonNegativeInteger}
    );
    return this;
  },
  current(val) {
    return this.set(as.current, val);
  },
  last(val) {
    return this.set(as.last, val);
  },
  first(val) {
    return this.set(as.first, val);
  },
  items(val) {
    throwif(this[_ordered] > 0,
      'Unordered items cannot be added when the collection already ' +
      'contains ordered items');
    this[_ordered] = -1;
    if (!val) return this;
    if (!Array.isArray(val) && arguments.length > 1)
      val = slice.call(arguments);
    this.set(as.items, val);
    return this;
  },
  orderedItems(val) {
    throwif(this[_ordered] < 0,
      'Ordered items cannot be added when the collection already ' +
      'contains unordered items');
    this[_ordered] = 1;
    if (!val) return this;
    if (!Array.isArray(val) && arguments.length > 1)
      val = slice.call(arguments);
    let set = false;
    if (!this[_items]) {
      this[_items] = new Base.Builder();
      set = true;
    }
    this[_items].set('@list', val);
    if (set)
      this.set(as.items, this[_items].get());
    return this;
  },
  get ordered() {
    return this[_ordered];
  }
});

Collection.Builder = CollectionBuilder;

module.exports = Collection;

'use strict';

const Base = require('../models/_base');
const composedType = Base.composedType;
const interval = require('vocabs-interval');
const xsd = require('vocabs-xsd');
const utils = require('../utils');
const is_string = utils.is_string;
const is_primitive = utils.is_primitive;
const is_integer = utils.is_integer;
const is_date = utils.is_date;
const is_boolean = utils.is_boolean;

function _set(target, key, val) {
  const options = {};
  if (is_primitive(val)) {
    if (is_string(val))
      options.type = xsd.string;
    else if (!isNaN(val)) {
      if (is_integer(val))
        options.type = xsd.integer;
      else
        options.type = xsd.decimal;
    } else if (is_boolean(val)) {
      options.type = xsd.boolean;
    }
  } else if (is_date(val)) {
    options.type = xsd.dateTime;
  }
  target.set(key, val, options);
}

const Interval = composedType(undefined, {
  get upper() {
    const upper = this.get(interval.upper);
    Object.defineProperty(this, 'upper', {
      enumerable: true,
      configurable: false,
      value: upper
    });
    return upper;
  },
  get lower() {
    const lower = this.get(interval.lower);
    Object.defineProperty(this, 'lower', {
      enumerable: true,
      configurable: false,
      value: lower
    });
    return lower;
  },
  get step() {
    const step = this.get(interval.step);
    Object.defineProperty(this, 'step', {
      enumerable: true,
      configurable: false,
      value: step
    });
    return step;
  }
});

const IntervalBuilder = composedType(undefined, {
  upper(val) {
    _set(this, interval.upper, val);
    return this;
  },
  lower(val) {
    _set(this, interval.lower, val);
    return this;
  },
  step(val) {
    _set(this, interval.step, val);
    return this;
  }
});
Interval.Builder = IntervalBuilder;

module.exports = Interval;

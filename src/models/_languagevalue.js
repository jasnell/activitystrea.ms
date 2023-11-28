'use strict';

const LanguageTag = require('rfc5646');
const _map = Symbol('map');

class LanguageValue {
  constructor(map) {
    this[_map] = map;
  }

  get(lang) {
    if (!lang) return this.get(LanguageValue.SYSLANG);
    const checktag = new LanguageTag(lang);
    if (this[_map].has(checktag.toString()))
      return this[_map].get(checktag.toString());
    for (const pair of this[_map]) {
      const key = new LanguageTag(pair[0]);
      if (checktag === '*' ||
          key.suitableFor(checktag) ||
          checktag.suitableFor(key))
        return pair[1];
    }
  }

  has(lang) {
    if (!lang) return this.get(LanguageValue.SYSLANG);
    const checktag = new LanguageTag(lang);
    return this[_map].has(checktag);
  }

  *[Symbol.iterator]() {
    for (const pair of this[_map])
      yield [pair[0].toString(), pair[1]];
  }

  valueOf(lang) {
    return this.get(lang);
  }
}

class LanguageValueBuilder {
  constructor() {
    this[_map] = new Map();
  }

  set(lang, value) {
    if (arguments.length === 1) {
      value = lang;
      lang = LanguageValue.SYSLANG;
    }
    this[_map].set(new LanguageTag(lang).toString(), value);
    return this;
  }
  
  get() {
    return new LanguageValue(this[_map]);
  }
}

LanguageValue.SYSLANG =
  process.env.LANG ?
    process.env.LANG.split('.')[0].replace('_', '-') : 'en-US';

LanguageValue.Builder = LanguageValueBuilder;

module.exports = LanguageValue;

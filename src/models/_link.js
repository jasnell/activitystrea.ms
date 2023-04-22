'use strict';

const range = require('../utils').range;
const as = require('vocabs-as');
const xsd = require('vocabs-xsd');
const Base = require('./_base');

class Link extends Base {
  constructor(expanded, builder, environment) {
    super(expanded, builder || Link.Builder, environment);
  }

  get href() {
    const ret = this.get(as.href);
    Object.defineProperty(this, 'href', {
      enumerable: true,
      configurable: false,
      value: ret ? ret.id : undefined
    });
    return ret ? ret.id : undefined;
  }

  get rel() {
    const rel = this.get(as.rel);
    Object.defineProperty(this, 'rel', {
      enumerable: true,
      configurable: false,
      value: rel
    });
    return rel;
  }

  get mediaType() {
    const mediaType = this.get(as.mediaType);
    Object.defineProperty(this, 'mediaType', {
      enumerable: true,
      configurable: false,
      value: mediaType
    });
    return mediaType;
  }

  get name() {
    const name = this.get(as.name);
    Object.defineProperty(this, 'name', {
      enumerable: true,
      configurable: false,
      value: name
    });
    return name
  }

  get hreflang() {
    const hreflang = this.get(as.hreflang);
    Object.defineProperty(this, 'hreflang', {
      enumerable: true,
      configurable: false,
      value: hreflang
    });
    return hreflang;
  }

  get height() {
    const ret = range(0, Infinity, this.get(as.height));
    Object.defineProperty(this, 'height', {
      enumerable: true,
      configurable: false,
      value: isNaN(ret) ? 0 : ret
    });
    return isNaN(ret) ? 0 : ret;
  }

  get width() {
    const ret = range(0, Infinity, this.get(as.width));
    Object.defineProperty(this, 'width', {
      enumerable: true,
      configurable: false,
      value: isNaN(ret) ? 0 : ret
    });
    return isNaN(ret) ? 0 : ret;
  }
}

class LinkBuilder extends Base.Builder {
  constructor(types, base, environment) {
    types = (types || []).concat([as.Link]);
    super(types, base || new Link({}, undefined, environment));
  }

  href(val) {
    this.set(as.href, val);
    return this;
  }

  rel(val) {
    this.set(as.rel, val);
    return this;
  }

  mediaType(val) {
    this.set(as.mediaType, val);
    return this;
  }

  name(val) {
    this.set(as.name, val);
    return this;
  }

  hreflang(val) {
    return this.set(as.hreflang, val);
  }

  height(val) {
    this.set(
      as.height,
      range(0, Infinity, val),
      {type: xsd.nonNegativeInteger});
    return this;
  }

  width(val) {
    this.set(
      as.width,
      range(0, Infinity, val),
      {type: xsd.nonNegativeInteger}
    );
    return this;
  }

}
Link.Builder = LinkBuilder;

module.exports = Link;

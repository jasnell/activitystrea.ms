'use strict';

const Readable = require('readable-stream').Readable;
const reasoner = require('../reasoner');
const LanguageValue = require('./_languagevalue');
const models = require('../models');
const jsonld = require('../jsonld');
const moment = require('moment');
const as = require('vocabs-as');
const asx = require('vocabs-asx');
const xsd = require('vocabs-xsd');
const owl = require('vocabs-owl');
const utils = require('../utils');
const Environment = require('../environment');
const kEnvironment = Environment.environment;
const throwif = utils.throwif;
const is_string = utils.is_string;

const _expanded = Symbol('expanded');
const _base = Symbol('base');
const _builder = Symbol('builder');
const _options = Symbol('options');
const _done = Symbol('done');
const _items = Symbol('items');
const _includes = Symbol('includes');

function is_literal(item) {
  return item && item.hasOwnProperty('@value');
}

function is_iterable(item) {
  if (item === undefined) { return false; }
  if (typeof item === 'string') { return false; }
  if (item[_expanded] !== undefined) { return false; } // It's a Base obj
  if (item instanceof LanguageValue) { return false; }
  if (item instanceof LanguageValue.Builder) { return false; }
  return typeof item[Symbol.iterator] === 'function';
}

function convert(item) {
  const type = item['@type'];
  let value = item['@value'];
  if (type) {
    const node = reasoner.node(type);
    if (node.is(asx.Number))
      value = Number(value);
    else if (node.is(xsd.duration))
      value = value;
    else if (node.is(asx.Date))
      value = moment(value);
    else if (node.is(asx.Boolean))
      value = value !== 'false';
  }
  return value;
}

class ValueIterator {
  constructor(items, environment) {
    this[_items] = items;
    this[kEnvironment] = environment;
  }
  
  *[Symbol.iterator] () {
    for (const item of this[_items]) {
      if (is_literal(item)) {
        yield convert(item);
      } else if (item['@list']) {
        for (const litem of item['@list']) {
          yield is_literal(litem) ?
            convert(litem) :
            models.wrap_object(litem, this[kEnvironment]);
        }
      } else {
        yield models.wrap_object(item, this[kEnvironment]);
      }
    }
  }

  get first() {
    const iter = this[Symbol.iterator]();
    const ret = iter.next().value;
    Object.defineProperty(this, 'first', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  }

  get length() {
    const items = this[_items];
    const ret = (items.length > 0 && items[0]['@list']) ?
      items[0]['@list'].length :
      items.length;
    Object.defineProperty(this, 'length', {
      enumerable: true,
      configurable: false,
      value: ret
    });
    return ret;
  }

  toArray() {
    return Array.from(this);
  }
}

class BaseReader extends Readable {
  constructor(base, options) {
    options = options || {};
    super(options);
    this[_base] = base;
    this[_options] = options;
  }

  _read() {
    if (this[_done]) return;
    const objectmode = this[_options].objectMode;
    this[_done] = true;
    const method =
      objectmode ?
        this[_base].export :
        this[_base].write;
    method.call(this[_base], this[_options], (err, doc) => {
      if (err) return this.emit('error', err);
      this.push(objectmode ? doc : new Buffer.from(doc, 'utf8'));
      this.push(null);
      return false;
    });
  }
}

function _compose(thing, types, base) {
  if (!types) return;
  if (!Array.isArray(types)) types = [types];
  thing[_includes] = thing[_includes] || new Map();
  for (const type of types) {
    if (type) {
      if (thing[_includes].get(type)) continue;
      if (type[_includes]) {
        for (const include of type[_includes]) {
          if (!(include instanceof base))
            _compose(thing, include, base);
        }
      }
      const props = {};
      for (const name of Object.getOwnPropertyNames(type)) {
        if (name !== 'Builder')
          props[name] = Object.getOwnPropertyDescriptor(type, name);
      }
      Object.defineProperties(thing, props);
      thing[_includes].set(type, true);
    }
  }
}

class Base {
  constructor(expanded, builder, environment) {
    this[kEnvironment] = environment || new Environment({});
    this[_expanded] = expanded || {};
    this[_builder] = builder || Base.Builder;
    models.compose_base(this, this.type);
  }

  /**
   * Get the unique @id of this object
   **/
  get id() {
    const id = this[_expanded]['@id'];
    Object.defineProperty(this, 'id', {
      enumerable: true,
      configurable: false,
      value: id
    });
    return id;
  }

  /**
   * Get the @type(s) of this object
   **/
  get type() {
    const types = this[_expanded]['@type'];
    return !types || types.length === 0 ? undefined :
           types.length === 1 ? types[0] :
           types;
  }

  /**
   * Returns true if the given key exists in the object
   **/
  has(key) {
    key = as[key] || key;
    const ret = this[_expanded][key];
    return ret && (ret.length > 0 || typeof ret === 'boolean');
  }

  /**
   * Return the value of the given key
   **/
  get(key) {
    key = as[key] || key;
    const nodekey = reasoner.node(key);
    const res = this[_expanded][key] || [];
    if (res.length === 0) return;
    if (nodekey.is(asx.LanguageProperty)) {
      const lvb = new LanguageValue.Builder();
      for (var n = 0; n < res.length; n++) {
        const item = res[n];
        const language = item['@language'] || LanguageValue.SYSLANG;
        const value = item['@value'];
        lvb.set(language, value);
      }
      return lvb.get();
    } else {
      if (nodekey.is(owl.FunctionalProperty)) {
        return is_literal(res[0]) ?
            convert(res[0]) :
            models.wrap_object(res[0], this[kEnvironment]);
      } else {
        return new ValueIterator(res, this[kEnvironment]);
      }
    }
  }

  /**
   * Export the object to a normal, 'unwrapped' JavaScript object
   **/
  export(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    if (options.useOriginalContext) {
      options.origContext =
        this[kEnvironment].origContext;
    }
    const handler = options.handler || jsonld.compact;
    handler(
      this[_expanded],
      options,
      callback);
  }

/**
 * Export the object to an RDF/Triple string
 **/
  toRDF(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    jsonld.normalize(
      this[_expanded],
      options,
      callback);
  }

  /**
  * Write the object out to a String
  **/
  write(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    this.export(options, function(err, doc) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, JSON.stringify(doc, null, options.space));
    });
  }

  /**
  * Write the object out to to a string with indenting
  **/
  prettyWrite(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options = options || {};
    options.space = options.space || 2;
    this.write(options, callback);
  }

  /**
  * Return a Readable Stream for this object
  **/
  stream(options) {
    return new BaseReader(this, options);
  }

  /**
  * Pipe this object out to the specified destination
  **/
  pipe(dest, options) {
    return this.stream(options).pipe(dest);
  }

  modify() {
    return new this[_builder](this.type, this);
  }

  template() {
    const Builder = this[_builder];
    const type = this.type;
    const exp = this[_expanded];
    const tmpl = {};
    for (const key of Object.keys(exp)) {
      let value = exp[key];
      if (Array.isArray(value))
        value = [].concat(value);
      tmpl[key] = value;
    }
    return () => {
      const bld = new Builder(type);
      bld[_expanded] = bld[_base][_expanded] = Object.create(tmpl);
      models.compose_builder(bld, type);
      models.compose_base(bld[_base], type);
      return bld;
    };
  }

  * [Symbol.iterator]() {
      for (const key of Object.keys(this[_expanded])) {
          yield key;
      }
  }

  [models.compose](types) {
    if (!types) return;
    if (!Array.isArray(types)) {
      types = (arguments.length > 1)? Array.prototype.slice.call(arguments) : [types];
    }
    _compose(this, types, Base);
  }

  static composedType(includes, def) {
    if (!Array.isArray(includes))
      includes = [includes];
    Object.setPrototypeOf(def, {
      get [_includes]() {
        return includes;
      }
    });
    return def;
  }
}

function setTypes(builder, types) {
  const exp = builder[_base][_expanded];
  if (!types || (types && types.length === 0)) {
    delete exp['@type'];
  } else {
    const ret = [];
    if (!Array.isArray(types)) types = [types];
    types = reasoner.reduce(types);
    for (const type of types) {
      ret.push(type.valueOf());
    }
    exp['@type'] = ret;
  }
}

class BaseBuilder {
  constructor(types, base, environment) {
    this[_base] = base || new Base(undefined, undefined, environment);
    setTypes(this, types);
    models.compose_base(this[_base], types);
    models.compose_builder(this, types);
  }

  set(key, val, options) {
    const expanded = this[_base][_expanded];
    options = options || {};
    if (val instanceof BaseBuilder || val instanceof LanguageValue.Builder)
      val = val.get();
    let n, l;
    key = as[key] || key;
    const nodekey = reasoner.node(key);
    if (val === null || val === undefined) {
      delete expanded[key];
      if (expanded[key] !== undefined)
        expanded[key] = null;
    } else {
      const is_iter = is_iterable(val);
      if (nodekey.is(owl.FunctionalProperty)) {
        throwif(is_iter, 'Functional properties cannot have array values');
        delete _expanded[key];
      }
      expanded[key] = expanded[key] || [];
      if (!is_iter) val = [val];
      for (const value of val) {
        if (nodekey.is(owl.ObjectProperty) ||
            value instanceof Base ||
            key === '@list') {
          if (value instanceof Base) {
            expanded[key].push(value[_expanded]);
          } else if (is_string(value)) {
            expanded[key].push({'@id': value});
          } else if (typeof value === 'object') {
            const base = new BaseBuilder();
            for (const k of Object.keys(value)) {
              const v = value[k];
              if (k === '@id') base.id(v);
              else if (k === '@type') base.type(v);
              else base.set(k, v);
            }
            expanded[key].push(base[_expanded]);
          } else {
            throw new Error('Invalid object property type');
          }
        } else if (value instanceof LanguageValue) {
          for (const pair of value) {
            expanded[key].push({
              '@language': pair[0],
              '@value': pair[1]
            });
          }
        } else {
          const ret = {
            '@value': value
          };
          if (options.lang) ret['@language'] = options.lang;
          if (options.type) ret['@type'] = options.type;
          expanded[key].push(ret);
        }
      }
    }
    return this;
  }

  id(val) {
    // TODO: verify that it's an absolute IRI
    this[_base][_expanded]['@id'] = val;
    return this;
  }

  get() {
    return this[_base];
  }

  export(options, callback) {
    return this.get().export(options, callback);
  }

  toRDF(options, callback) {
    return this.get().toRDF(options, callback);
  }

  write(options, callback) {
    return this.get().write(options, callback);
  }

  prettyWrite(options, callback) {
    return this.get().prettyWrite(options, callback);
  }

  stream(options) {
    return this.get().stream(options);
  }

  pipe(dest, options) {
    return this.get().pipe(dest, options);
  }

  template() {
    return this.get().template();
  }

  [models.compose](types) {
    if (!types) return;
    if (!Array.isArray(types)) {
      types = (arguments.length > 1)? Array.prototype.slice.call(arguments) : [types];
    }
    _compose(this, types, Base.Builder);
  }
}
Base.Builder = BaseBuilder;

module.exports = Base;

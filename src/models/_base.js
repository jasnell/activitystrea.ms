'use strict';

const Readable = require('readable-stream').Readable;
const LRU = require('lru-cache');
const request = require('request');
const reasoner = require('../reasoner');
const LanguageValue = require('./_languagevalue');
const models = require('../models');
const jsonld = require('../jsonld');
const moment = require('moment');
const as = require('vocabs-as');
const asx = require('vocabs-asx');
const xsd = require('vocabs-xsd');
const owl = require('vocabs-owl');
const throwif = require('../utils').throwif;
const is_string = require('../utils').is_string;
const Environment = require('../environment');

const _expanded = Symbol('expanded');
const _cache = Symbol('cache');
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
  return item &&
    typeof item !== 'string' &&
    !(item instanceof Base) &&
    (typeof item[Symbol.iterator] === 'function') &&
    !(item instanceof LanguageValue) &&
    !(item instanceof LanguageValue.Builder);
}

function convert(item) {
  let type = item['@type'];
  let value = item['@value'];
  if (type) {
    let node = reasoner.node(type);
    if (node.is(asx.Number))
      value = Number(value);
    else if (node.is(xsd.duration))
      value = value;
    else if (node.is(asx.Date))
      value = moment(value);
    else if (node.is(asx.Boolean))
      value = value != 'false';
  }
  return value;
}

class ValueIterator {
  constructor(items, environment) {
    this[_items] = items;
    this[Environment.environment] = environment;
  }
  *[Symbol.iterator] () {
    for (let item of this[_items]) {
      if (is_literal(item)) {
        yield convert(item);
      } else if (item['@list']) {
        for (let litem of item['@list']) {
          yield is_literal(litem) ?
            convert(litem) :
            models.wrap_object(litem, this[Environment.environment]);
        }
      } else {
        yield models.wrap_object(item, this[Environment.environment]);
      }
    }
  }

  get first() {
    return this[Symbol.iterator]().next().value;
  }

  get length() {
    return (this[_items].length > 0 && this[_items][0]['@list']) ?
      this[_items][0]['@list'].length :
      this[_items].length;
  }

  toArray() {
    return Array.from(this);
  }
}

class BaseReader extends Readable {
  constructor(base, options) {
    options = options || {};
    options.highwaterMark = options.highwaterMark || '16kb';
    super(options);
    this[_base] = base;
    this[_options] = options;
  }
  _read() {
    if (this[_done]) return;
    let objectmode = this[_options].objectMode;
    this[_done] = true;
    let method =
      objectmode ?
        this[_base].export :
        this[_base].write;
    method.call(this[_base], this[_options], (err,doc)=> {
      if (err) {
        this.emit('error', err);
      } else {
        this.push(objectmode ? doc : new Buffer(doc, 'utf8'));
        this.push(null);
      }
      return false;
    });
  }
}

function _compose(thing, types, base) {
  // todo: implement caching so we're not redefining properties
  if (!types) return;
  if (!Array.isArray(types)) types = [types];
  thing[_includes] = thing[_includes] || new Map();
  for (let type of types) {
    if (type) {
      if (thing[_includes].get(type)) continue;
      if (type[_includes]) {
        for (let include of type[_includes]) {
          if (!(include instanceof base))
            _compose(thing, include, base);
        }
      }
      let props = {};
      for (let name of Object.getOwnPropertyNames(type)) {
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
    this[Environment.environment] = environment || new Environment({});
    this[_expanded] = expanded || {};
    this[_cache] = LRU({
      max: 20,
      maxAge: 1000 * 60 * 60
    });
    this[_builder] = builder || Base.Builder;
    models.compose_base(this, this.type);
  }

  /**
   * Get the unique @id of this object
   **/
  get id() {
    return this[_expanded]['@id'];
  }

  /**
   * Get the @type(s) of this object
   **/
  get type() {
    let types = this[_expanded]['@type'];
    return !types || types.length === 0 ? undefined :
           types.length === 1 ? types[0] :
           types;
  }

  /**
   * Returns true if the given key exists in the object
   **/
  has(key) {
    key = as[key] || key;
    let ret = this[_expanded][key];
    return ret && (ret.length > 0 || typeof ret === 'boolean');
  }

  /**
   * Return the value of the given key
   **/
  get(key) {
    key = as[key] || key;
    let ret = this[_cache].get(key);
    if (!ret) {
      let nodekey = reasoner.node(key);
      let res = this[_expanded][key] || [];
      if (!res.length) return;
      if (nodekey.is(asx.LanguageProperty)) {
        let lvb = new LanguageValue.Builder();
        res.forEach((item)=>{
          let language = item['@language'] || LanguageValue.SYSLANG;
          let value = item['@value'];
          lvb.set(language, value);
        });
        ret = lvb.get();
      } else {
        res = new ValueIterator(res, this[Environment.environment]);
        ret = nodekey.is(owl.FunctionalProperty) ?
          res.first : res;
      }
      this[_cache].set(key, ret);
    }
    return ret;
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
        this[Environment.environment].origContext;
    }
    let handler = options.handler || jsonld.compact;
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
     this.export(options, function(err,doc) {
       if (err) {
         callback(err);
         return;
       }
       callback(null, JSON.stringify(doc,null,options.space));
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

   send(options, callback) {
     if (typeof options === 'string') {
       options = {url:options};
     } else {
       options = options || {};
     }
     setImmediate(()=> {
       options.headers = options.headers || {};
       options.headers['Content-Type'] = as.mediaType;
       this.pipe(
         request.post(options)
                .on('response', (res)=> {
                  callback(null,res.statusCode,res);
                })
                .on('error', callback),
         options
       );
     });
   }

   modify() {
     return new this[_builder](this.type, this);
   }

   template() {
     let Builder = this[_builder];
     let type = this.type;
     let exp = this[_expanded];
     let tmpl = {};
     for (let key of Object.keys(exp)) {
       let value = exp[key];
       if (Array.isArray(value))
         value = [].concat(value);
       tmpl[key] = value;
     }
     return ()=> {
       let bld = new Builder(type);
       bld[_expanded] = bld[_base][_expanded] = Object.create(tmpl);
       models.compose_builder(bld, type);
       models.compose_base(bld[_base], type);
       return bld;
     };
   }

   * [Symbol.iterator]() {
       for (let key of Object.keys(this[_expanded])) {
           yield key;
       }
   }

   [models.compose](types) {
     if (!types) return;
     if (!Array.isArray(types)) {
       if (arguments.length > 1) {
         types = Array.prototype.slice.call(arguments);
       } else types = [types];
     }
     _compose(this, types, Base);
   }
}

function setTypes(builder, types) {
  let exp = builder[_base][_expanded];
  if (!types || (types && types.length === 0)) {
    delete exp['@type'];
  } else {
    let ret = [];
    if (!Array.isArray(types)) types = [types];
    types = reasoner.reduce(types);
    for (let type of types) {
      ret.push(type.valueOf());
    }
    exp['@type'] = ret;
  }
}

class BaseBuilder {
  constructor(types, base, environment) {
    this[_base] = base || new Base(undefined, undefined, environment);
    setTypes(this,types);
    models.compose_base(this[_base], types);
    models.compose_builder(this, types);
  }

  /**
   * Set the value of the given key
   **/
   set(key, val, options) {
     let expanded = this[_base][_expanded];
     options = options || {};
     if (val instanceof BaseBuilder || val instanceof LanguageValue.Builder)
       val = val.get();
     let n, l;
     key = as[key] || key;
     let nodekey = reasoner.node(key);
     if (val === null || val === undefined) {
       delete expanded[key];
       if (typeof expanded[key] !== 'undefined') {
         expanded[key] = null;
       }
     } else {
       let is_iter = is_iterable(val);
       if (nodekey.is(owl.FunctionalProperty)) {
         throwif(is_iter, 'Functional properties cannot have array values');
         delete _expanded[key];
       }
       expanded[key] = expanded[key] || [];
       if (!is_iter) val = [val];
       for (let value of val) {
         if (nodekey.is(owl.ObjectProperty) ||
             value instanceof Base ||
             key == '@list') {
           if (value instanceof Base) {
             expanded[key].push(value[_expanded]);
           } else if (is_string(value)) {
             expanded[key].push({'@id': value});
           } else if (typeof value === 'object') {
             let base = new Base();
             for (let k of Object.keys(value)) {
               let v = value[k];
               if (k === '@id') base.id(v);
               else if (k === '@type') base.type(v);
               else base.set(k, v);
             }
             expanded[key].push(base[_expanded]);
           } else {
             throw new Error('Invalid object property type');
           }
         } else if (value instanceof LanguageValue) {
           for (let pair of value) {
             expanded[key].push({
               '@language': pair[0],
               '@value': pair[1]
             });
           }
         } else {
           let ret = {
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

   /**
    * Set the unique @id of this object
    **/
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

   send(options, callback) {
     return this.get().send(options, callback);
   }

   template() {
     return this.get().template();
   }
   
   [models.compose](types) {
     if (!types) return;
     if (!Array.isArray(types)) {
       if (arguments.length > 1) {
         types = Array.prototype.slice.call(arguments);
       } else types = [types];
     }
     _compose(this, types, Base.Builder);
   }
}
Base.Builder = BaseBuilder;

Base.composedType = function(includes, def) {
  if (!Array.isArray(includes))
    includes = [includes];
  Object.setPrototypeOf(def, {
    get [_includes]() {
      return includes;
    }
  });
  return def;
};

module.exports = Base;

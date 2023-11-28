'use strict';

const moment = require('moment');
const xsd = require('vocabs-xsd');
const _toString = {}.toString;

class Utils {

  static throwif(condition, message) {
    if (condition) throw Error(message);
  }

  static range(min, max, val) {
    return Math.min(max, Math.max(min, val));
  }

  static is_primitive(val) {
    return val === null ||
           val === undefined ||
           Utils.is_string(val) ||
           !isNaN(val) ||
           Utils.is_boolean(val);
  }

  static is_string(val) {
    return typeof val === 'string' ||
           val instanceof String ||
           _toString.apply(val) === '[object String]';
  }

  static is_boolean(val) {
    return typeof val === 'boolean' ||
           val instanceof Boolean ||
           _toString.apply(val) === '[object Boolean]';
  }

  static is_date(val) {
    return val instanceof Date ||
           _toString.apply(val) === '[object Date]' ||
           moment.isMoment(val);
  }

  static is_integer(val) {
    return !isNaN(val) &&
      isFinite(val) &&
      val > -9007199254740992 &&
      val < 9007199254740992 &&
      Math.floor(val) === val;
  }

  static set_date_val(key, val) {
    Utils.throwif(!Utils.is_date(val), `${key} must be a date`);
    const fmt = moment.isMoment(val) ? val.format() : val.toISOString();
    this.set(key, fmt, {type: xsd.dateTime});
  }

  static set_ranged_val(key, val, min, max, type) {
    Utils.throwif(isNaN(val), `${key} must be a number`);
    if (!isFinite(val)) return;
    this.set(key, Utils.range(min, max, val), {type: type});
  }

  static set_non_negative_int(key, val) {
    Utils.throwif(isNaN(val), `${key} must be a number`);
    if (!isFinite(val)) return;
    this.set(key,
      Utils.range(0, Infinity, Math.floor(val)),
      {type: xsd.nonNegativeInteger});
  }

  static set_duration_val(key, val) {
    Utils.throwif(
      isNaN(val) &&
      !Utils.is_string(val) &&
      typeof val.humanize === 'undefined',
      `${key} must be a number or a string`);
    val = !isNaN(val) ?
      moment.duration(val * 1000).toString() :
      val.toString();
    this.set(key, val, {type: xsd.duration});
  }
}

module.exports = Utils;

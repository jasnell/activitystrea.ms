const as = require('vocabs-as');
const Activity = require('./_activity');
const Base = require('./_base');
const set_date_val = require('../utils').set_date_val;
const composedType = Base.composedType;

const Question = composedType(Activity, {
  get anyOf() {
    const anyOf = this.get(as.anyOf);
    Object.defineProperty(this, 'anyOf', {
      enumerable: true,
      configurable: false,
      value: anyOf
    });
    return anyOf;
  },
  get oneOf() {
    const oneOf = this.get(as.oneOf);
    Object.defineProperty(this, 'oneOf', {
      enumerable: true,
      configurable: false,
      value: oneOf
    });
    return oneOf;
  },
  get closed() {
    const closed = this.get(as.closed);
    Object.defineProperty(this, 'closed', {
      enumerable: true,
      configurable: false,
      value: closed
    });
    return closed;
  }
});

const QuestionBuilder = composedType(Activity.Builder, {
  anyOf(val) {
    return this.set(as.anyOf, val);
  },
  oneOf(val) {
    return this.set(as.oneOf, val);
  },
  closed(val) {
    set_date_val.call(this, as.closed, val);
    return this;
  }
});
Question.Builder = QuestionBuilder;

module.exports = Question;

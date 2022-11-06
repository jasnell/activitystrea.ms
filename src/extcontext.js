const ctx = [];

module.exports = {
  add(context) {
    ctx.push(context);
  },
  get() {
    return ctx;
  }
};

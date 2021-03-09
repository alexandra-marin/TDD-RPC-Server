module.exports = class Bus {
  constructor() {
    this.handlers = {};
  }

  postMessage(message, target) {
    if (!target) {
      throw new Error('must specify a target');
    }

    if (!this.handlers[target]) {
      throw new Error('no handlers for that target');
    }

    this.handlers[target].forEach((hdl) => setTimeout(() => hdl.call(null, JSON.stringify(message)), 0));
  }

  onMessage(receiver, source) {
    if (typeof receiver !== 'function') {
      throw new Error('receiver must be a function');
    }

    if (typeof source !== 'string') {
      throw new Error('source must be a string');
    }

    if (!this.handlers[source]) {
      this.handlers[source] = [];
    }

    this.handlers[source].push(receiver);
  }
}
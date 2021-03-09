module.exports = class Server {
  constructor(bus, source, target) {
    this.bus = bus;
    this.handlers = {};
    this.source = source;
    this.target = target;
    this.bus.onMessage(this.onMessage.bind(this), this.source);
  }

  /**
   * Adds a new method that the Server should execute.
   *
   * @param name - The name of the method to execute.
   * @param handler - The method itself. Should consume two arguments: an array of parameters, and a callback
   * with typical Node.js (error, result) arguments.
   */
  addHandler(name, handler) {
    this.handlers[name] = handler;
  }

  onMessage(rawData) {
    const data = JSON.parse(rawData);
    try {
      this.handlers[data.method].call(null, data.params, (err, result) => {
        if (err) {
          this.bus.postMessage({
            id: data.id,
            error: {
              code: err.code,
              data: err.data
            }
          }, this.target);
        } else {
          this.bus.postMessage({
            id: data.id,
            result,
          }, this.target);
        }
      });
    } catch (e) {
      this.bus.postMessage({
        id: data.id,
        error: {
          code: -1,
          data: e.message
        }
      }, this.target);
    }
  }
};
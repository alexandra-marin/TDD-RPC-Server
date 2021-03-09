var Q = require("Q");

module.exports = class Client {
  constructor(bus, source, target, timeout) {
    this.bus = bus;
    this.source = source;
    this.target = target;
    this.currentMessages = {};
    this.timeout = timeout || 30000;
    this.lastId = 0;
    this.bus.onMessage(this.onMessage.bind(this), this.source);
  }

  /**
   * Calls a method on the Server by sending a message on the Bus.
   *
   * Returns a promise with the result of the remote procedure call.
   *
   * @param method - The name of the method to call.
   * @param params - The list of parameters to call the method with.
   * @return Promise
   */
  callRemote(method, ...params) {
    const id = this.lastId++;
    const promise = Q.defer();
    this.currentMessages[id] = promise;

    this.bus.postMessage({
      id,
      method, 
      params
    }, this.target);

    setTimeout(() => {
      delete this.currentMessages[id];
      promise.reject({code: -200, message: 'Timeout'});
    }, this.timeout);

    return promise.promise;
  }

  /**
   * Private method that handles server responses the the Bus.
   *
   * @param data - The response data.
   * @private
   */
  onMessage(data) {
    const {id, error, result} = JSON.parse(data);
    const promise = this.currentMessages[id];
    if(!promise) return;
    
    if(error) {
      promise.reject(error);
    } else {
      promise.resolve(result);
    }

    delete this.currentMessages[id];
  }
};
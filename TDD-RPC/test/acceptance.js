const Bus = require('../lib/bus');
const Client = require('../client');
const Server = require('../server');
const assert = require('chai').assert;

describe('Acceptance tests', () => {
  let bus;
  let client;
  let server;

  before(() => {
    bus = new Bus();
    client = new Client(bus, 'foreground', 'background', 1000);
    server = new Server(bus, 'background', 'foreground');
    server.addHandler('method_returning_first_arg', (args, doneCallback) => doneCallback(null, args[0]));
    server.addHandler('method_using_two_args', (args, doneCallback) => doneCallback(null, args[0] + args[1]));
    server.addHandler('method_returning_error', (_, doneCallback) => doneCallback({
      code: -100,
      data: 'this here is an error'
    }, null));
    server.addHandler('method_throwing_error', () => {
      throw new Error('this is an exception in the method itself');
    });
  });

  it('should handle single arguments', async () => {
    let res = await client.callRemote('method_returning_first_arg', 'honk');
    assert.strictEqual(res, 'honk');
    res = await client.callRemote('method_returning_first_arg', {
      hello: 'hi'
    });
    assert.deepStrictEqual(res, {
      hello: 'hi'
    });
  });

  it('should handle multiple arguments', async () => {
    let res = await client.callRemote('method_using_two_args', 2, 3);
    assert.strictEqual(res, 5);
  });

  it('should reject the promise when the doneCallback is called with an error', async () => {
    try {
      await client.callRemote('method_returning_error');
    } catch (e) {
      assert.strictEqual(e.code, -100);
      assert.strictEqual(e.data, 'this here is an error');
      return;
    }

    assert.fail('expected an error');
  });

  it('should reject the promise when an error occurs inside the server handler', async () => {
    try {
      await client.callRemote('method_throwing_error');
    } catch (e) {
      assert.strictEqual(e.code, -1);
      assert.strictEqual(e.data, 'this is an exception in the method itself');
      return;
    }

    assert.fail('expected an error');
  });

  it('should handle time outs if server does not reply', async () => {
    try {
      server.addHandler('method_not_replying', (args, doneCallback) => {
        setTimeout(() => {
          doneCallback()
        }, 1500);
      });

      await client.callRemote('method_not_replying');
    } catch (e) {
      assert.strictEqual(e.code, -200);
      assert.strictEqual(e.message, 'Timeout');
      return;
    }

    assert.fail('expected an error');
  });
});
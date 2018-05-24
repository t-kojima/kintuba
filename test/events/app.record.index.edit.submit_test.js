/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.edit.submit', () => {
  const method = 'app.record.index.edit.submit';
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.type, method);
  });

  describe('.success', () => {
    const success = 'app.record.index.edit.submit.success';
    afterEach(() => kintone.events.off(success));

    it('イベントが発火すること', async () => {
      kintone.events.on(success, event => event);
      const event = await kintone.events.do(success);
      assert.equal(event.type, success);
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('イベントが発火すること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.type, method);
    });

    describe('.success', () => {
      const success = 'app.record.index.edit.submit.success';
      beforeEach(() => kintone.events.off(success));

      it('イベントが発火すること', async () => {
        kintone.events.on(success, event => event);
        const event = await kintone.events.do(success);
        assert.equal(event.type, success);
      });
    });
  });
});

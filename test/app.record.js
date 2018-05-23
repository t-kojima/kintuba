/* eslint-disable no-undef */
require('../lib');
const { assert } = require('chai');

describe('app.record', () => {
  describe('app.record.index.show', () => {
    const method = 'app.record.index.show';
    afterEach(() => kintone.events.off(method));

    it('kintone.app.record.get()がnullであること', async () => {
      kintone.events.on(method, event => event);
      await kintone.events.do(method);
      assert.isNull(kintone.app.record.get());
    });
  });

  describe('app.record.index.edit.show', () => {
    const method = 'app.record.index.edit.show';
    afterEach(() => kintone.events.off(method));

    it('kintone.app.record.get()がnullであること', async () => {
      kintone.events.on(method, event => event);
      await kintone.events.do(method);
      assert.isNull(kintone.app.record.get());
    });
  });

  describe('app.record.detail.show', () => {
    const method = 'app.record.detail.show';
    afterEach(() => kintone.events.off(method));

    it('kintone.app.record.get()が取得できること', async () => {
      kintone.events.on(method, event => event);
      await kintone.events.do(method);
      const record = kintone.app.record.get();
      assert.equal(record.record['数値'].value, '99');
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });

    after(() => {
      kintone.loadDefault();
    });

    describe('app.record.detail.show', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('kintone.app.record.get()がnullであること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method);
        assert.isNull(kintone.app.record.get());
      });
    });
  });
});

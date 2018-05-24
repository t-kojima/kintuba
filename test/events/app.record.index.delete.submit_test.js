/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.delete.submit', () => {
  const delMethod = 'app.record.index.delete.submit';
  const showMethod = 'app.record.index.show';
  afterEach(() => {
    kintone.events.off(delMethod);
    kintone.events.off(showMethod);
  });

  describe('return event;', () => {
    it('レコードが削除されること', async () => {
      kintone.events.on(delMethod, event => event);
      await kintone.events.do(delMethod, { recordId: '1' });

      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 2);
    });

    it('削除結果が次のテストに波及すること', async () => {
      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 2);
    });

    it('削除結果がリセットされること', async () => {
      kintone.loadDefault();
      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 3);
    });
  });

  describe('return false;', () => {
    it('レコードが削除されないこと', async () => {
      kintone.events.on(delMethod, () => false);
      await kintone.events.do(delMethod, { recordId: '1' });

      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 3);
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    describe('return event;', () => {
      it('レコードが削除できないこと', async () => {
        kintone.events.on(delMethod, event => event);
        await kintone.events.do(delMethod, { recordId: '1' });

        kintone.events.on(showMethod, event => event);
        const event = await kintone.events.do(showMethod);
        assert.equal(event.size, 0);
      });
    });

    describe('return false;', () => {
      it('レコードが削除されないこと', async () => {
        kintone.events.on(delMethod, () => false);
        await kintone.events.do(delMethod, { recordId: '1' });

        kintone.events.on(showMethod, event => event);
        const event = await kintone.events.do(showMethod);
        assert.equal(event.size, 0);
      });
    });
  });

  describe('fixture2 を読み込んだ場合', () => {
    before(() => kintone.loadFixture('.kinmock/fixture2'));
    after(() => kintone.loadDefault());

    describe('return event;', () => {
      it('レコードが削除されること', async () => {
        kintone.events.on(delMethod, event => event);
        await kintone.events.do(delMethod, { recordId: '1' });

        kintone.events.on(showMethod, event => event);
        const event = await kintone.events.do(showMethod);
        assert.equal(event.size, 0);
      });
    });
  });
});

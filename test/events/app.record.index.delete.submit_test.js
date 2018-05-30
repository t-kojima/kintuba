/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const { assert } = require('chai');

const getSize = async () => {
  const method = 'app.record.index.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method);
  kintone.events.off(method);
  return event.size;
};

describe('app.record.index.delete.submit', () => {
  const method = 'app.record.index.delete.submit';
  afterEach(() => kintone.events.off(method));
  after(() => kintone.loadDefault());

  describe('return event;', () => {
    it('レコードが削除されること', async () => {
      kintone.events.on(method, event => event);
      await kintone.events.do(method, { recordId: '1' });

      const size = await getSize();
      assert.equal(size, 2);
    });

    it('削除結果が次のテストに波及すること', async () => {
      const size = await getSize();
      assert.equal(size, 2);
    });

    it('削除結果がリセットされること', async () => {
      kintone.loadDefault();
      const size = await getSize();
      assert.equal(size, 3);
    });
  });

  describe('return false;', () => {
    it('レコードが削除されないこと', async () => {
      kintone.events.on(method, () => false);
      await kintone.events.do(method, { recordId: '1' });

      const size = await getSize();
      assert.equal(size, 3);
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
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });

        const size = await getSize();
        assert.equal(size, 0);
      });
    });

    describe('return false;', () => {
      it('レコードが削除されないこと', async () => {
        kintone.events.on(method, () => false);
        await kintone.events.do(method, { recordId: '1' });

        const size = await getSize();
        assert.equal(size, 0);
      });
    });
  });

  describe('fixture2 を読み込んだ場合', () => {
    before(() => kintone.loadFixture('.kinmock/fixture2'));
    after(() => kintone.loadDefault());

    describe('return event;', () => {
      it('レコードが削除されること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });

        const size = await getSize();
        assert.equal(size, 0);
      });
    });
  });
});

/* eslint-disable no-undef, no-param-reassign */
require('../../.');
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
  before(() => kintone.fixture.load());
  afterEach(() => kintone.events.off(method));
  after(() => kintone.fixture.load());

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
      kintone.fixture.load();
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

  describe('return kintone.Promise', () => {
    it('非同期処理を待ってイベントが走ること', async () => {
      kintone.events.on(method, event =>
        new kintone.Promise((resolve) => {
          // レコード0件
          kintone.fixture.load('.');
          resolve(getSize());
        }).then((response) => {
          if (response === 0) {
            // レコード101件
            kintone.fixture.load('.kintuba/handred');
          }
          return event;
        }));
      await kintone.events.do(method, { recordId: '1' });

      const size = await getSize();
      assert.equal(size, 100);
    });
  });

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      kintone.schema.load('.');
      kintone.fixture.load('.');
    });
    after(() => {
      kintone.schema.load();
      kintone.fixture.load();
    });

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
    before(() => kintone.fixture.load('.kintuba/fixture2'));
    after(() => kintone.fixture.load());

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

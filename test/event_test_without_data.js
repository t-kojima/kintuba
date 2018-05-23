/* eslint-disable no-undef */
require('../lib');
const { assert } = require('chai');

describe('.kinmockディレクトリが無い場合', () => {
  before(() => {
    kintone.loadSchema();
    kintone.loadFixture();
  });

  after(() => {
    kintone.loadDefault();
  });

  describe('app.record.index.show', () => {
    const method = 'app.record.index.show';
    beforeEach(() => kintone.events.off(method));

    it('イベントが発火すること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.type, method);
    });

    it('Eventオブジェクトが取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.type, method);
    });

    it('レコード配列が空配列であること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.deepEqual(event.records, []);
    });

    describe('ビュー選択', () => {
      it('デフォルトビューが取得できること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method);
        assert.equal(event.viewId, '20');
      });

      it('カスタムビュー(5519903)が取得できないこと', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { viewId: '5519903' });
        assert.equal(event.viewId, '20');
      });
    });
  });

  describe('app.record.index.edit.show', () => {
    const method = 'app.record.index.edit.show';
    beforeEach(() => kintone.events.off(method));

    it('未指定の場合、id=1が取得できないこと', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.recordId, '0');
      assert.deepEqual(event.record, {});
    });

    it('データが存在しない場合、id=0が取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '999' });
      assert.equal(event.recordId, '0');
      assert.deepEqual(event.record, {});
    });
  });

  describe('app.record.index.edit.submit', () => {
    const method = 'app.record.index.edit.submit';
    beforeEach(() => kintone.events.off(method));

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

  describe('app.record.index.edit.change.<フィールド>', () => {
    const method = 'app.record.index.edit.change.数値';
    beforeEach(() => kintone.events.off(method));

    it('イベントが発火しないこと', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.isNull(event);
    });
  });

  describe('app.record.index.delete.submit', () => {
    const delMethod = 'app.record.index.delete.submit';
    const showMethod = 'app.record.index.show';
    beforeEach(() => {
      kintone.events.off(delMethod);
      kintone.events.off(showMethod);
    });

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
});

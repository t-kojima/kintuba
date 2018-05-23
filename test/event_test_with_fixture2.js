/* eslint-disable no-undef */
require('../lib');
const { assert } = require('chai');

describe('fixture2 を読み込んだ場合', () => {
  before(() => kintone.loadFixture('.kinmock/fixture2'));
  after(() => kintone.loadDefault());

  describe('app.record.index.show', () => {
    const method = 'app.record.index.show';
    afterEach(() => kintone.events.off(method));

    it('テストデータが取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.records[0]['数値'].value, '77');
    });
  });

  describe('app.record.index.edit.show', () => {
    const method = 'app.record.index.edit.show';
    afterEach(() => kintone.events.off(method));

    it('未指定の場合、id=1が取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.recordId, '1');
      assert.equal(event.record.$id.value, '1');
    });

    it('データが存在しない場合、id=0が取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '999' });
      assert.equal(event.recordId, '0');
      assert.deepEqual(event.record, {});
    });
  });

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
        assert.equal(event.size, 0);
      });
    });
  });
});

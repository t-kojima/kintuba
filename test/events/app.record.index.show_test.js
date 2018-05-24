/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.show', () => {
  const method = 'app.record.index.show';
  afterEach(() => kintone.events.off(method));

  it('テストデータが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.records[0]['数値'].value, '99');
  });

  describe('ビュー選択', () => {
    it('デフォルトビューが取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.viewId, '20');
    });

    it('カスタムビュー(5519903)が取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { viewId: '5519903' });
      assert.equal(event.viewId, '5519903');
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });

    after(() => kintone.loadDefault());

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

  describe('fixture2 を読み込んだ場合', () => {
    before(() => kintone.loadFixture('.kinmock/fixture2'));
    after(() => kintone.loadDefault());

    it('テストデータが取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.records[0]['数値'].value, '77');
    });
  });
});

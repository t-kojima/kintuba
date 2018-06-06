/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('getId', () => {
  it('schemaのappIdが返ること', async () => {
    const actual = kintone.app.getId();
    assert.equal(actual, '2');
  });

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('nullが返ること', async () => {
      const actual = kintone.app.getId();
      assert.isNull(actual);
    });
  });
});

describe('getLookupTargetAppId', () => {
  describe('ルックアップフィールドの場合', () => {
    it('ルックアップ先ののappIdが返ること', async () => {
      const actual = kintone.app.getLookupTargetAppId('ルックアップ');
      assert.equal(actual, '5');
    });
  });

  describe('ルックアップフィールドではない場合', () => {
    it('nullが返ること', async () => {
      const actual = kintone.app.getLookupTargetAppId('数値');
      assert.isNull(actual);
    });
  });

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('nullが返ること', async () => {
      const actual = kintone.app.getLookupTargetAppId('ルックアップ');
      assert.isNull(actual);
    });
  });
});

describe('getQueryCondition', () => {
  describe('レコード一覧画面', () => {
    const method = 'app.record.index.show';
    afterEach(() => kintone.events.off(method));

    it('カスタムビューの絞り込み情報を取得できること', async () => {
      await kintone.events.do(method, { viewId: '5519903' });
      const actual = kintone.app.getQueryCondition();
      assert.equal(actual, '数値 >= "1000" and 文字列__1行_ not like "NGWORD"');
    });

    it('デフォルトビューの場合空文字が返ること', async () => {
      await kintone.events.do(method);
      const actual = kintone.app.getQueryCondition();
      assert.equal(actual, '');
    });
  });

  describe('レコード詳細画面', () => {
    const method = 'app.record.detail.show';
    afterEach(() => kintone.events.off(method));

    it('nullが返ること', async () => {
      await kintone.events.do(method, { recordId: '1', viewId: '5519903' });
      const actual = kintone.app.getQueryCondition();
      assert.isNull(actual);
    });
  });
});

describe('getQuery', () => {
  // getQueryConditionと同一の挙動とする
});
/* eslint-disable no-undef */
require('../lib');
const { assert } = require('chai');

describe('kintone関数', () => {
  it('UI Versionが2であること', () => {
    const actual = kintone.getUiVersion();
    assert.equal(actual, 2);
  });

  it('ログインユーザーが取得できること', () => {
    const actual = kintone.getLoginUser();
    assert.equal(actual.name, 'no-name');
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
});

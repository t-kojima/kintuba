/* eslint-disable no-undef, no-param-reassign */
require('../../.');
const { assert } = require('chai');
const fixture = require('../../fixture');

const getActual = async id => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.create.change.<フィールド>', () => {
  const method = 'app.record.create.change.数値';
  beforeEach(() => fixture.load());
  afterEach(() => kintone.events.off(method));

  describe('テーブルに行を追加した場合', () => {
    xit('changes.rowは追加したオブジェクトを参照できること', async () => {});
  });

  describe('テーブルの行を削除した場合', () => {
    xit('changes.rowはnullであること', async () => {});
  });

  describe('テーブル外のフィールドを変更した場合', () => {
    xit('changes.rowはnullであること', async () => {});
  });

  describe('ルックアップの取得を自動で行う場合', () => {
    it('ルックアップ先に反映させない', async () => {
      kintone.events.on(method, event => {
        event.record.ルックアップ.lookup = true;
        event.record.ルックアップ.value = 'テスト';
      });
      await kintone.events.do(method, { recordId: '1', value: '99' });

      const actual = await getActual('1');
      assert.equal(actual['文字列__1行_'].value, 'DUMMY');
    });
  });

  xdescribe('フィールドの表示／非表示を切り替える', () => {});
});

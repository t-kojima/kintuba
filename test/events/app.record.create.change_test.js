/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.create.change.<フィールド>', () => {
  const method = 'app.record.create.change.数値';
  afterEach(() => {
    kintone.events.off(method);
    kintone.loadDefault();
  });

  describe('テーブルに行を追加した場合', () => {
    xit('changes.rowは追加したオブジェクトを参照できること', async () => {});
  });

  describe('テーブルの行を削除した場合', () => {
    xit('changes.rowはnullであること', async () => {});
  });

  describe('テーブル外のフィールドを変更した場合', () => {
    xit('changes.rowはnullであること', async () => {});
  });

  xdescribe('ルックアップの取得を自動で行う', () => {});

  xdescribe('フィールドの表示／非表示を切り替える', () => {});
});

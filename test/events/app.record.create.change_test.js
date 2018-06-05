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

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1', value: '99' });
    assert.equal(event.type, method);
  });

  it('field.typeが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1', value: '99' });
    assert.equal(event.changes.field.type, 'NUMBER');
  });

  it('設定したvalueが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1', value: '991' });
    assert.equal(event.changes.field.value, '991');
  });

  it('設定したvalueが反映されること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events.do(method, { recordId: '1', value: '992' });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '992');
  });

  it('idが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method)
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'recordId option is required.'));
  });

  it('valueが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method, { recordId: '1' })
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'value option is required.'));
  });

  it('存在しないフィールドは動作しないこと', async () => {
    const unknown = 'app.record.index.edit.change.存在しないフィールド';
    kintone.events.on(unknown, event => event);
    const event = await kintone.events.do(unknown, { recordId: '1', value: '993' });
    assert.isNull(event);
  });

  it('許可されないフィールドは動作しないこと', async () => {
    const disallow = 'app.record.index.edit.change.文字列__複数行_';
    kintone.events.on(disallow, event => event);
    const event = await kintone.events.do(disallow, { recordId: '1', value: '994' });
    assert.isNull(event);
  });

  it('recordのフィールドを変更した場合反映されること', async () => {
    kintone.events.on(method, (event) => {
      event.record['文字列__複数行_'].value = 'DUMMY2';
      return event;
    });
    await kintone.events.do(method, { recordId: '1', value: '99' });

    const actual = await getActual('1');
    assert.equal(actual['文字列__複数行_'].value, 'DUMMY2');
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

  describe('フィールドの編集可／不可を設定する', () => {
    it('プロパティ上は編集不可となる', async () => {
      kintone.events.on(method, (event) => {
        event.record.数値.disabled = true;
        return event;
      });
      await kintone.events.do(method, {
        recordId: '1',
        value: '99',
      });

      const actual = await getActual('1');
      assert.isTrue(actual.数値.disabled);
    });
  });

  describe('フィールドにエラーを表示する', () => {
    it('プロパティ上はエラーメッセージが設定される', async () => {
      kintone.events.on(method, (event) => {
        event.record.数値.error = 'ERROR MESSAGE';
        return event;
      });
      await kintone.events.do(method, {
        recordId: '1',
        value: '99',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.error, 'ERROR MESSAGE');
    });
  });

  describe('画面の上部にエラーを表示する', () => {
    it('エラーメッセージは保持されない', async () => {
      kintone.events.on(method, (event) => {
        event.error = 'ERROR MESSAGE';
        return event;
      });
      await kintone.events.do(method, {
        recordId: '1',
        value: '99',
      });

      const actual = await getActual('1');
      assert.isUndefined(actual.error);
    });
  });

  xdescribe('ルックアップの取得を自動で行う', () => {});

  xdescribe('フィールドの表示／非表示を切り替える', () => {});

  describe('returnしない場合', () => {
    it('recordのフィールドを変更しても反映されないこと', async () => {
      kintone.events.on(method, (event) => {
        event.record['文字列__複数行_'].value = 'DUMMY2';
      });
      await kintone.events.do(method, { recordId: '1', value: '99' });

      const actual = await getActual('1');
      assert.equal(actual['文字列__複数行_'].value, 'DUMMY1\nDUMMY2\n');
    });

    it('トリガーとなった値の変更はキャンセルされないこと', async () => {
      kintone.events.on(method, (event) => {
        event.record['文字列__複数行_'].value = 'DUMMY2';
      });
      await kintone.events.do(method, { recordId: '1', value: '999' });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '999');
    });
  });
});

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

describe('app.record.create.show', () => {
  const method = 'app.record.create.show';
  beforeEach(() => fixture.load());
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, {
      recordId: 1,
    });
    assert.equal(event.type, method);
  });

  it('idが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method)
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'recordId option is required.'));
  });

  it('reuseは常にfalseを返すこと', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, {
      recordId: 1,
    });
    assert.isFalse(event.reuse);
  });

  it('recordのフィールドを書き換えた時、値が反映されること', async () => {
    kintone.events.on(method, event => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, {
      recordId: '1',
    });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '999');
  });

  describe('returnしない場合', () => {
    it('recordのフィールドを書き換えた時、値が反映されないこと', async () => {
      kintone.events.on(method, event => {
        event.record.数値.value = '999';
      });
      await kintone.events.do(method, {
        recordId: '1',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
    });
  });

  describe('return false', () => {
    it('recordのフィールドを書き換えた時、値が反映されないこと', async () => {
      kintone.events.on(method, event => {
        event.record.数値.value = '999';
        return false;
      });
      await kintone.events.do(method, {
        recordId: '1',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
    });
  });

  describe('フィールドの編集不可を設定する', () => {
    it('プロパティ上は編集不可となる', async () => {
      kintone.events.on(method, event => {
        event.record.数値.disabled = true;
        return event;
      });
      await kintone.events.do(method, {
        recordId: '1',
      });

      const actual = await getActual('1');
      assert.isTrue(actual.数値.disabled);
    });
  });

  describe('フィールドにエラーを表示する', () => {
    it('プロパティ上はエラーメッセージが設定される', async () => {
      kintone.events.on(method, event => {
        event.record.数値.error = 'ERROR MESSAGE';
        return event;
      });
      await kintone.events.do(method, {
        recordId: '1',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.error, 'ERROR MESSAGE');
    });
  });

  describe('画面の上部にエラーを表示する', () => {
    it('エラーメッセージは保持されない', async () => {
      kintone.events.on(method, event => {
        event.error = 'ERROR MESSAGE';
        return event;
      });
      await kintone.events.do(method, {
        recordId: '1',
      });

      const actual = await getActual('1');
      assert.isUndefined(actual.error);
    });
  });

  describe('ルックアップの取得を自動で行う場合', () => {
    it('ルックアップ先に反映させない', async () => {
      kintone.events.on(method, event => {
        event.record.ルックアップ.lookup = true;
        event.record.ルックアップ.value = 'テスト';
      });
      await kintone.events.do(method, { recordId: '1' });

      const actual = await getActual('1');
      assert.equal(actual['文字列__1行_'].value, 'DUMMY');
    });
  });

  xdescribe('フィールドの表示／非表示を切り替える', () => {});
});

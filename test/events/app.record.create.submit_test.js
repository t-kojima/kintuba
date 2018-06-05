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

describe('app.record.create.submit', () => {
  const method = 'app.record.create.submit';
  afterEach(() => {
    kintone.events.off(method);
    kintone.loadDefault();
  });

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, {
      recordId: '1',
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

  it('recordのフィールドを書き換えた時、値が反映されること', async () => {
    kintone.events.on(method, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, {
      recordId: '1',
    });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '999');
  });

  describe('return false', () => {
    it('recordのフィールドを書き換えた時、値が反映されないこと', async () => {
      kintone.events.on(method, (event) => {
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

  describe('フィールドにエラーを表示する', () => {
    it('プロパティ上はエラーメッセージが設定される', async () => {
      kintone.events.on(method, (event) => {
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
      kintone.events.on(method, (event) => {
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

  xdescribe('フィールドの表示／非表示を切り替える', () => {});

  describe('return kintone.Promise', () => {
    xit('非同期処理を待ってイベントが走ること', async () => {});
  });
});
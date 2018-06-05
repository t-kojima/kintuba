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

describe('app.record.index.edit.submit.success', () => {
  const success = 'app.record.index.edit.submit.success';
  afterEach(() => kintone.events.off(success));

  it('イベントが発火すること', async () => {
    kintone.events.on(success, event => event);
    const event = await kintone.events.do(success, { recordId: '1' });
    assert.equal(event.type, success);
  });

  it('recordのフィールドを変更した時、反映されないこと', async () => {
    kintone.events.on(success, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(success, { recordId: '1' });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '99');
  });

  describe('urlプロパティを指定した場合', () => {
    xit('http://cybozu.co.jp/へ遷移すること', async () => {});
  });

  describe('保存が失敗した場合', () => {
    xit('イベントが走らないこと', async () => {});
  });

  describe('return kintone.Promise', () => {
    xit('非同期処理を待ってイベントが走ること', async () => {});
  });
});

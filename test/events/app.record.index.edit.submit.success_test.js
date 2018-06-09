/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const schema = require('../../lib/schema');
const fixture = require('../../lib/fixture');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.index.edit.submit.success', () => {
  const method = 'app.record.index.edit.submit.success';
  beforeEach(() => fixture.load());
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1' });
    assert.equal(event.type, method);
  });

  it('recordのフィールドを変更した時、反映されないこと', async () => {
    kintone.events.on(method, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '99');
  });

  describe('urlプロパティを指定した場合', () => {
    // xit('指定したurlへ遷移すること', async () => {});
    // スタブでは遷移しない
  });

  describe('保存が失敗した場合', () => {
    // it('イベントが走らないこと', async () => {});
    // スタブでは検証不可
  });

  describe('return kintone.Promise', () => {
    it('非同期処理を待ってイベントが走ること', async () => {
      kintone.events.on(method, event =>
        new kintone.Promise((resolve) => {
          resolve('TEST MESSAGE');
        }).then((response) => {
          event.test = response;
          return event;
        }));
      const event = await kintone.events.do(method, { recordId: '1' });
      assert.equal(event.test, 'TEST MESSAGE');
    });
  });

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      schema.load('.');
      fixture.load('.');
    });
    after(() => {
      schema.load();
      fixture.load();
    });

    it('イベントが発火すること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '1' });
      assert.equal(event.type, method);
    });
  });
});

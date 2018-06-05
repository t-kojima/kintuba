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

describe('app.record.index.edit.submit', () => {
  const method = 'app.record.index.edit.submit';
  afterEach(() => {
    kintone.events.off(method);
    kintone.loadDefault();
  });

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1' });
    assert.equal(event.type, method);
  });

  it('recordのフィールドを変更した時、反映されること', async () => {
    kintone.events.on(method, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '999');
  });

  it('書き換えできないフィールドを変更した時、反映されないこと', async () => {
    kintone.events.on(method, (event) => {
      event.record.文字列__1行__AUTO_CALC.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });

    const actual = await getActual('1');
    assert.equal(actual.文字列__1行__AUTO_CALC.value, '');
  });

  xdescribe('フィールドにエラーを表示する', () => {});

  xdescribe('画面の上部にエラーを表示する', () => {});

  describe('return kintone.Promise', () => {
    xit('非同期処理を待ってイベントが走ること', async () => {});
  });

  describe('returnしない場合', () => {
    it('recordのフィールドを変更した時、反映されないこと', async () => {
      kintone.events.on(method, (event) => {
        event.record.数値.value = '999';
      });
      await kintone.events.do(method, { recordId: '1' });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('イベントが発火すること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '1' });
      assert.equal(event.type, method);
    });

    describe('.success', () => {
      const success = 'app.record.index.edit.submit.success';
      beforeEach(() => kintone.events.off(success));

      it('イベントが発火すること', async () => {
        kintone.events.on(success, event => event);
        const event = await kintone.events.do(success, { recordId: '1' });
        assert.equal(event.type, success);
      });
    });
  });
});

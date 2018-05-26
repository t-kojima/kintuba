/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.edit.submit', () => {
  const method = 'app.record.index.edit.submit';
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1' });
    assert.equal(event.type, method);
  });

  it('設定したvalueが反映されること', async () => {
    kintone.events.on(method, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });
    kintone.events.off(method);

    const show = 'app.record.index.edit.show';
    kintone.events.on(show, event => event);
    const event = await kintone.events.do(show, { recordId: '1' });
    kintone.events.off(show);
    assert.equal(event.record.数値.value, '999');
  });

  describe('returnしない場合', () => {
    it('設定したvalueが反映されないこと', async () => {
      let before;
      kintone.events.on(method, (event) => {
        before = event.record.数値.value;
        event.record.数値.value = '777';
      });
      await kintone.events.do(method, { recordId: '1' });
      kintone.events.off(method);

      const show = 'app.record.index.edit.show';
      kintone.events.on(show, event => event);
      const event = await kintone.events.do(show, { recordId: '1' });
      kintone.events.off(show);
      assert.equal(event.record.数値.value, before);
    });
  });

  describe('.success', () => {
    const success = 'app.record.index.edit.submit.success';
    afterEach(() => kintone.events.off(success));

    it('イベントが発火すること', async () => {
      kintone.events.on(success, event => event);
      const event = await kintone.events.do(success, { recordId: '1' });
      assert.equal(event.type, success);
    });

    it('設定したvalueが反映されないこと', async () => {
      let before;
      kintone.events.on(success, (event) => {
        before = event.record.数値.value;
        event.record.数値.value = '8888';
        return event;
      });
      await kintone.events.do(success, { recordId: '1' });
      kintone.events.off(success);

      const show = 'app.record.index.edit.show';
      kintone.events.on(show, event => event);
      const event = await kintone.events.do(show, { recordId: '1' });
      kintone.events.off(show);
      assert.equal(event.record.数値.value, before);
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

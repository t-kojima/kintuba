/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const { assert } = require('chai');

describe('app.record.detail.show', () => {
  const method = 'app.record.detail.show';
  afterEach(() => kintone.events.off(method));

  it('idが未指定の場合Errorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method)
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'recordId option is required.'));
  });

  it('存在しないidを指定した場合、undefinedが取得されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '999' });
    assert.isUndefined(event.recordId);
    assert.isUndefined(event.record);
  });

  it('存在するidを指定した場合、指定のデータが取得されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '2' });
    assert.equal(event.recordId, '2');
    assert.equal(event.record.$id.value, '2');
  });

  it('recordのフィールドを書き換えたとき反映されないこと', async () => {
    let before;
    kintone.events.on(method, (event) => {
      before = event.record.数値.value;
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });
    kintone.events.off(method);

    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1' });
    assert.equal(event.record.数値.value, before);
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('idが未指定の場合Errorになること', async () => {
      kintone.events.on(method, event => event);
      await kintone.events
        .do(method)
        .then(() => assert.fail())
        .catch(e => assert.equal(e.message, 'recordId option is required.'));
    });

    it('存在しないidを指定した場合、undefinedが取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '999' });
      assert.isUndefined(event.recordId);
      assert.isUndefined(event.record);
    });
  });

  describe('fixture2 を読み込んだ場合', () => {
    before(() => kintone.loadFixture('.kinmock/fixture2'));
    after(() => kintone.loadDefault());

    it('idが未指定の場合Errorになること', async () => {
      kintone.events.on(method, event => event);
      await kintone.events
        .do(method)
        .then(() => assert.fail())
        .catch(e => assert.equal(e.message, 'recordId option is required.'));
    });

    it('存在しないidを指定した場合、undefinedが取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '999' });
      assert.isUndefined(event.recordId);
      assert.isUndefined(event.record);
    });

    it('存在するidを指定した場合、指定のデータが取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '1' });
      assert.equal(event.recordId, '1');
      assert.equal(event.record.$id.value, '1');
    });
  });
});

/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.edit.show', () => {
  const method = 'app.record.index.edit.show';
  afterEach(() => kintone.events.off(method));

  it('idが未指定の場合、id=1が取得されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.recordId, '1');
    assert.equal(event.record.$id.value, '1');
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

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('idが未指定の場合、undefinedが取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.isUndefined(event.recordId);
      assert.isUndefined(event.record);
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

    it('idが未指定の場合、id=1が取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.recordId, '1');
      assert.equal(event.record.$id.value, '1');
    });

    it('存在しないidを指定した場合、undefinedが取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { recordId: '999' });
      assert.isUndefined(event.recordId);
      assert.isUndefined(event.record);
    });
  });
});

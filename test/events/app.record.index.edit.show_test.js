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

describe('app.record.index.edit.show', () => {
  const method = 'app.record.index.edit.show';
  afterEach(() => {
    kintone.events.off(method);
    kintone.loadDefault();
  });

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
    kintone.events.on(method, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });
    kintone.events.off(method);

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '99');
  });

  xdescribe('フィールドの編集可／不可を設定する', () => {});

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

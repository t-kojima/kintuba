/* eslint-disable no-undef, no-param-reassign */
require('../../.');
const { assert } = require('chai');
const fixture = require('../../fixture');
const schema = require('../../schema');

const getActual = async id => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.index.edit.show', () => {
  const method = 'app.record.index.edit.show';
  beforeEach(() => fixture.load());
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
    kintone.events.on(method, event => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, { recordId: '1' });
    kintone.events.off(method);

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '99');
  });

  describe('フィールドの編集可／不可を設定する', () => {
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

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      schema.load('.');
      fixture.load('.');
    });
    after(() => {
      schema.load();
      fixture.load();
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
  });

  describe('fixture2 を読み込んだ場合', () => {
    before(() => fixture.load('.kintuba/fixture2'));
    after(() => fixture.load());

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

/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.edit.change.<フィールド>', () => {
  const method = 'app.record.index.edit.change.数値';
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.type, method);
  });

  it('field.typeが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.changes.field.type, 'NUMBER');
  });

  it('設定したvalueが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1', value: '999' });
    assert.equal(event.changes.field.value, '999');
  });

  it('設定したvalueが反映されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '1', value: '999' });
    assert.equal(event.record.数値.value, '999');
  });

  it('idが未指定の場合はid=1になること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.recordId, '1');
  });

  it('存在しないフィールドは動作しないこと', async () => {
    const unknown = 'app.record.index.edit.change.存在しないフィールド';
    kintone.events.on(unknown, event => event);
    const event = await kintone.events.do(unknown);
    assert.isNull(event);
  });

  it('許可されないフィールドは動作しないこと', async () => {
    const disallow = 'app.record.index.edit.change.文字列__複数行_';
    kintone.events.on(disallow, event => event);
    const event = await kintone.events.do(disallow);
    assert.isNull(event);
  });

  describe('ラジオボタンの場合', () => {
    it('空白指定はデフォルトに値になること', async () => {
      const radio = 'app.record.index.edit.change.ラジオボタン';
      kintone.events.on(radio, event => event);
      const event = await kintone.events.do(radio, { recordId: '1', value: '' });
      assert.equal(event.record.ラジオボタン.value, 'sample1');
    });
  });

  describe('文字列かつ自動計算の場合', () => {
    it('値の書き換えができないこと', async () => {
      const creator = 'app.record.index.edit.change.文字列__1行__AUTO_CALC';
      kintone.events.on(creator, event => event);
      const event = await kintone.events.do(creator, { recordId: '1', value: '9999' });
      assert.equal(event.changes.field.value, '9999');
      assert.equal(event.record.文字列__1行__AUTO_CALC.value, '');
    });
  });

  describe('ルックアップフィールドの場合', () => {
    it('値の書き換えができないこと', async () => {
      const creator = 'app.record.index.edit.change.ルックアップ';
      kintone.events.on(creator, event => event);
      const event = await kintone.events.do(creator, { recordId: '1', value: '9999' });
      assert.equal(event.changes.field.value, '9999');
      assert.equal(event.record.ルックアップ.value, '');
    });
  });

  describe('ルックアップコピー先フィールドの場合', () => {
    it('値の書き換えができないこと', async () => {
      const creator = 'app.record.index.edit.change.文字列__1行_';
      kintone.events.on(creator, event => event);
      const event = await kintone.events.do(creator, { recordId: '1', value: '9999' });
      assert.equal(event.changes.field.value, '9999');
      assert.equal(event.record['文字列__1行_'].value, 'DUMMY');
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('イベントが発火しないこと', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.isNull(event);
    });
  });
});

/* eslint-disable no-undef */
require('../lib');
const { assert } = require('chai');

describe('app.record.index.show', () => {
  const method = 'app.record.index.show';
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.type, method);
  });

  it('Eventオブジェクトが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.type, method);
  });

  it('テストデータが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.records[0]['数値'].value, '99');
  });

  describe('ビュー選択', () => {
    it('デフォルトビューが取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.viewId, '20');
    });

    it('カスタムビュー(5519903)が取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, { viewId: '5519903' });
      assert.equal(event.viewId, '5519903');
    });
  });
});

describe('app.record.index.edit.show', () => {
  const method = 'app.record.index.edit.show';
  afterEach(() => kintone.events.off(method));

  it('未指定の場合、id=1が取得されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.recordId, '1');
    assert.equal(event.record.$id.value, '1');
  });

  it('データが存在しない場合、id=0が取得されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '999' });
    assert.equal(event.recordId, '0');
    assert.deepEqual(event.record, {});
  });

  it('データが存在する場合、指定のデータが取得されること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, { recordId: '2' });
    assert.equal(event.recordId, '2');
    assert.equal(event.record.$id.value, '2');
  });
});

describe('app.record.index.edit.submit', () => {
  const method = 'app.record.index.edit.submit';
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.type, method);
  });

  describe('.success', () => {
    const success = 'app.record.index.edit.submit.success';
    afterEach(() => kintone.events.off(success));

    it('イベントが発火すること', async () => {
      kintone.events.on(success, event => event);
      const event = await kintone.events.do(success);
      assert.equal(event.type, success);
    });
  });
});

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
    const event = await kintone.events.do(method, { value: '999' });
    assert.equal(event.changes.field.value, '999');
  });

  it('recordIdが1になること', async () => {
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
});

describe('app.record.index.delete.submit', () => {
  const delMethod = 'app.record.index.delete.submit';
  const showMethod = 'app.record.index.show';
  afterEach(() => {
    kintone.events.off(delMethod);
    kintone.events.off(showMethod);
  });

  describe('return event;', () => {
    it('レコードが削除されること', async () => {
      kintone.events.on(delMethod, event => event);
      await kintone.events.do(delMethod, { recordId: '1' });

      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 2);
    });

    it('削除結果が次のテストに波及すること', async () => {
      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 2);
    });

    it('削除結果がリセットされること', async () => {
      kintone.loadDefault();
      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 3);
    });
  });

  describe('return false;', () => {
    it('レコードが削除されないこと', async () => {
      kintone.events.on(delMethod, () => false);
      await kintone.events.do(delMethod, { recordId: '1' });

      kintone.events.on(showMethod, event => event);
      const event = await kintone.events.do(showMethod);
      assert.equal(event.size, 3);
    });
  });
});

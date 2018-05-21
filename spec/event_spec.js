/* eslint-disable no-undef */
require('../lib');

describe('app.record.index.show', () => {
  const method = 'app.record.index.show';

  it('イベントが発火すること', () => {
    let called;
    kintone.events.on(method, () => {
      called = true;
    });
    kintone.events.do(method);
    expect(called).toBeTruthy();
  });

  it('Eventオブジェクトが取得できること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event.type;
    });
    kintone.events.do(method);
    expect(actual).toEqual(method);
  });

  it('テストデータが取得できること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event.records[0]['数値'].value;
    });
    kintone.events.do(method);
    expect(actual).toEqual('99');
  });

  describe('ビュー選択', () => {
    it('デフォルトビューが取得できること', () => {
      let actual;
      kintone.events.on(method, (event) => {
        actual = event.viewId;
      });
      kintone.events.do(method);
      expect(actual).toEqual('20');
    });

    it('カスタムビュー(5519903)が取得できること', () => {
      let actual;
      kintone.events.on(method, (event) => {
        actual = event.viewId;
      });
      kintone.events.do(method, { viewId: '5519903' });
      expect(actual).toEqual('5519903');
    });
  });
});

describe('app.record.index.edit.show', () => {
  const method = 'app.record.index.edit.show';

  it('未指定の場合、id=1が取得されること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event;
    });
    kintone.events.do(method);
    expect(actual.recordId).toEqual('1');
    expect(actual.record.$id.value).toEqual('1');
  });

  it('データが存在しない場合、id=0が取得されること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event;
    });
    kintone.events.do(method, { recordId: '999' });
    expect(actual.recordId).toEqual('0');
    expect(actual.record).toEqual({});
  });

  it('データが存在する場合、指定のデータが取得されること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event;
    });
    kintone.events.do(method, { recordId: '2' });
    expect(actual.recordId).toEqual('2');
    expect(actual.record.$id.value).toEqual('2');
  });
});

describe('app.record.index.edit.submit', () => {
  const method = 'app.record.index.edit.submit';

  it('イベントが発火すること', () => {
    let called;
    kintone.events.on(method, () => {
      called = true;
    });
    kintone.events.do(method);
    expect(called).toBeTruthy();
  });

  describe('.success', () => {
    it('イベントが発火すること', () => {
      let called;
      kintone.events.on(`${method}.success`, () => {
        called = true;
      });
      kintone.events.do(`${method}.success`);
      expect(called).toBeTruthy();
    });
  });
});

describe('app.record.index.edit.change.<フィールド>', () => {
  const method = 'app.record.index.edit.change.数値';

  it('イベントが発火すること', () => {
    let called;
    kintone.events.on(method, () => {
      called = true;
    });
    kintone.events.do(method);
    expect(called).toBeTruthy();
  });

  it('typeが取得できること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event.changes.field.type;
    });
    kintone.events.do(method);
    expect(actual).toEqual('NUMBER');
  });

  it('設定したvalueが取得できること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event.changes.field.value;
    });
    kintone.events.do(method, { value: '999' });
    expect(actual).toEqual('999');
  });

  it('recordIdが1になること', () => {
    let actual;
    kintone.events.on(method, (event) => {
      actual = event.recordId;
    });
    kintone.events.do(method);
    expect(actual).toEqual('1');
  });

  it('存在しないフィールドは動作しないこと', () => {
    let called;
    kintone.events.on('app.record.index.edit.change.存在しないフィールド', () => {
      called = true;
    });
    kintone.events.do('app.record.index.edit.change.存在しないフィールド');
    expect(called).toBeFalsy();
  });
});

/* eslint-disable no-undef */
require('../lib');

describe('イベント：app.record.index.show', () => {
  const event = 'app.record.index.show';

  it('イベントが発火すること', () => {
    let called = false;

    kintone.events.on(event, () => {
      called = true;
    });
    kintone.events.do(event);
    expect(called).toBeTruthy();
  });

  it('Eventオブジェクトが取得できること', () => {
    let actual = null;
    kintone.events.on(event, (ev) => {
      actual = ev.type;
    });
    kintone.events.do(event);
    expect(actual).toEqual(event);
  });

  it('テストデータが取得できること', () => {
    let actual = null;
    kintone.events.on(event, (ev) => {
      actual = ev.records[0]['数値'].value;
    });
    kintone.events.do(event);
    expect(actual).toEqual('777');
  });

  describe('ビュー選択', () => {
    it('デフォルトビューが取得できること', () => {
      kintone.events.on(event, (ev) => {
        actual = ev.viewId;
      });
      kintone.events.do(event);
      expect(actual).toEqual('20');
    });

    it('カスタムビュー(5519903)が取得できること', () => {
      kintone.events.on(event, (ev) => {
        actual = ev.viewId;
      });
      kintone.events.do(event, { viewId: '5519903' });
      expect(actual).toEqual('5519903');
    });
  });
});

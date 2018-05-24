/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('app.record.index.show', () => {
  const method = 'app.record.index.show';
  afterEach(() => kintone.events.off(method));

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

  describe('カレンダービュー', () => {
    before(() => kintone.loadFixture('.kinmock/calendar'));
    after(() => kintone.loadDefault());

    /*
    テストデータ
    1: 日付がブランク
    2: 日付がnull
    3: 日付が翌月（2018-06）
    4: 日付が当月（2018-05-18）
    5: 日付が当月（2018-05-18）
    6: 日付が当月（2018-05-19）
    */

    describe('date=nullの場合', () => {
      it('エラーになること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events
          .do(method, { viewId: '5519905' })
          .then(() => assert.fail())
          .catch(e => assert.equal(e.message, 'date option is required when selected calendar'));
      });
    });

    describe('date=2018-05の場合', () => {
      it('dateが設定されること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { viewId: '5519905', date: '2018-05' });
        assert.equal(event.date, '2018-05');
      });

      it('offsetとsizeがnullになること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { viewId: '5519905', date: '2018-05' });
        assert.isNull(event.offset);
        assert.isNull(event.size);
      });

      it('日付キーにレコードが設定されること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { viewId: '5519905', date: '2018-05' });
        assert.lengthOf(event.records['2018-05-18'], 2);
        assert.lengthOf(event.records['2018-05-19'], 1);
      });
    });
  });

  describe('.kinmockディレクトリが無い場合', () => {
    before(() => {
      kintone.loadSchema('.');
      kintone.loadFixture('.');
    });
    after(() => kintone.loadDefault());

    it('レコード配列が空配列であること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.deepEqual(event.records, []);
    });

    describe('ビュー選択', () => {
      it('デフォルトビューが取得できること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method);
        assert.equal(event.viewId, '20');
      });

      it('カスタムビュー(5519903)が取得できないこと', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { viewId: '5519903' });
        assert.equal(event.viewId, '20');
      });
    });
  });

  describe('fixture2 を読み込んだ場合', () => {
    before(() => kintone.loadFixture('.kinmock/fixture2'));
    after(() => kintone.loadDefault());

    it('テストデータが取得できること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.records[0]['数値'].value, '77');
    });
  });
});

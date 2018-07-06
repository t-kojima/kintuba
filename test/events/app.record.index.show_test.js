/* eslint-disable no-undef, no-param-reassign */
require('../../.');
const fixture = require('../../fixture');
const schema = require('../../schema');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.index.show', () => {
  const method = 'app.record.index.show';
  before(() => {
    fixture.load();
    schema.load();
  });
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

  it('recordsのフィールドを変更した時、反映されないこと', async () => {
    kintone.events.on(method, (event) => {
      event.records.filter(a => a.$id.value === '1')[0].数値.value = '999';
      return event;
    });
    await kintone.events.do(method);

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '99');
  });

  describe('カレンダービュー', () => {
    before(() => fixture.load('.kintuba/calendar'));
    after(() => fixture.load());

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

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      schema.load('.');
      fixture.load('.');
    });
    after(() => {
      schema.load();
      fixture.load();
    });

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

  describe('handred を読み込んだ場合', () => {
    before(() => fixture.load('.kintuba/handred'));
    after(() => fixture.load());

    it('取得件数が100であること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method);
      assert.equal(event.size, 100);
    });

    describe('offset=20', () => {
      it('取得件数が81で先頭IDが21であること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { offset: 20 });
        assert.equal(event.size, 81);
        assert.equal(event.records[0].$id.value, '21');
      });
    });

    describe('limit=40', () => {
      it('取得件数が40で先頭IDが1であること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { limit: 40 });
        assert.equal(event.size, 40);
        assert.equal(event.records[0].$id.value, '1');
      });
    });

    describe('offset=20 and limit=40', () => {
      it('取得件数が40かつoffset=20で先頭IDが21、最終IDが60であること', async () => {
        kintone.events.on(method, event => event);
        const event = await kintone.events.do(method, { offset: 20, limit: 40 });
        assert.equal(event.offset, 20);
        assert.equal(event.size, 40);
        assert.equal(event.records[0].$id.value, '21');
        assert.equal(event.records[40 - 1].$id.value, '60');
      });
    });
  });
});

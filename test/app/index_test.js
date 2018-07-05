/* eslint-disable no-undef, no-unused-vars */
require('../../.');
const fixture = require('../../fixture');
const schema = require('../../schema');
const { assert } = require('chai');

describe('getId', () => {
  it('schemaのappIdが返ること', async () => {
    const actual = kintone.app.getId();
    assert.equal(actual, '2');
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

    it('nullが返ること', async () => {
      const actual = kintone.app.getId();
      assert.isNull(actual);
    });
  });
});

describe('getLookupTargetAppId', () => {
  describe('ルックアップフィールドの場合', () => {
    it('ルックアップ先ののappIdが返ること', async () => {
      const actual = kintone.app.getLookupTargetAppId('ルックアップ');
      assert.equal(actual, '5');
    });
  });

  describe('ルックアップフィールドではない場合', () => {
    it('nullが返ること', async () => {
      const actual = kintone.app.getLookupTargetAppId('数値');
      assert.isNull(actual);
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

    it('nullが返ること', async () => {
      const actual = kintone.app.getLookupTargetAppId('ルックアップ');
      assert.isNull(actual);
    });
  });
});

describe('getRelatedRecordsTargetAppId', () => {
  describe('関連レコード一覧の場合', () => {
    it('関連レコード一覧ののappIdが返ること', async () => {
      const actual = kintone.app.getRelatedRecordsTargetAppId('関連レコード一覧');
      assert.equal(actual, '5');
    });
  });

  describe('関連レコード一覧ではない場合', () => {
    it('nullが返ること', async () => {
      const actual = kintone.app.getRelatedRecordsTargetAppId('数値');
      assert.isNull(actual);
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

    it('nullが返ること', async () => {
      const actual = kintone.app.getRelatedRecordsTargetAppId('関連レコード一覧');
      assert.isNull(actual);
    });
  });
});

describe('getQueryCondition', () => {
  describe('レコード一覧画面', () => {
    const method = 'app.record.index.show';
    afterEach(() => kintone.events.off(method));

    it('カスタムビューの絞り込み情報を取得できること', async () => {
      await kintone.events.do(method, { viewId: '5519903' });
      const actual = kintone.app.getQueryCondition();
      assert.equal(actual, '数値 >= "1000" and 文字列__1行_ not like "NGWORD"');
    });

    it('デフォルトビューの場合空文字が返ること', async () => {
      await kintone.events.do(method);
      const actual = kintone.app.getQueryCondition();
      assert.equal(actual, '');
    });
  });

  describe('レコード詳細画面', () => {
    const method = 'app.record.detail.show';
    afterEach(() => kintone.events.off(method));

    it('nullが返ること', async () => {
      await kintone.events.do(method, { recordId: '1', viewId: '5519903' });
      const actual = kintone.app.getQueryCondition();
      assert.isNull(actual);
    });
  });
});

describe('getQuery', () => {
  // getQueryConditionと同一の挙動とする
});

describe('getFieldElements', () => {
  describe('レコード一覧画面', () => {
    const method = 'app.record.index.show';
    afterEach(() => kintone.events.off(method));

    it('ReferenceErrorになること（本来空divを返す）', async () => {
      await kintone.events.do(method);
      (() => kintone.app.getFieldElements('数値')).should.throw(
        ReferenceError,
        'document is not defined',
      );
    });

    describe('レコードが0件の場合', () => {
      before(async () => {
        fixture.load('.kintuba/fixture2');
        const del = 'app.record.index.delete.submit';
        kintone.events.on(del, event => event);
        await kintone.events.do(del, { recordId: '1' });
        kintone.events.off(del);
      });
      after(() => {
        schema.load();
        fixture.load();
      });

      it('空配列が返ること', async () => {
        await kintone.events.do(method);
        const actual = kintone.app.getFieldElements('数値');
        assert.deepEqual(actual, []);
      });
    });
  });

  describe('レコード詳細画面', () => {
    const method = 'app.record.detail.show';
    afterEach(() => kintone.events.off(method));

    it('nullが返ること', async () => {
      await kintone.events.do(method, { recordId: '1' });
      const actual = kintone.app.getFieldElements('数値');
      assert.isNull(actual);
    });
  });

  describe('.kintubaディレクトリが無い場合', () => {
    const method = 'app.record.index.show';
    before(() => {
      schema.load('.');
      fixture.load('.');
    });
    after(() => {
      schema.load();
      fixture.load();
    });

    it('nullが返ること', async () => {
      await kintone.events.do(method);
      const actual = kintone.app.getFieldElements('数値');
      assert.isNull(actual);
    });
  });
});

describe('getHeaderSpaceElement', () => {
  describe('レコード一覧画面', () => {
    const method = 'app.record.index.show';
    afterEach(() => kintone.events.off(method));

    it('ReferenceErrorになること（本来document.bodyを返す）', async () => {
      await kintone.events.do(method);
      (() => kintone.app.getHeaderSpaceElement()).should.throw(
        ReferenceError,
        'document is not defined',
      );
    });
  });

  describe('レコード詳細画面', () => {
    const method = 'app.record.detail.show';
    afterEach(() => kintone.events.off(method));

    it('nullが返ること', async () => {
      await kintone.events.do(method, { recordId: '1' });
      const actual = kintone.app.getHeaderSpaceElement();
      assert.isNull(actual);
    });
  });
});

describe('getHeaderMenuSpaceElement', () => {
  // getHeaderSpaceElementと同一
});

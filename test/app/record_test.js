/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');
const should = require('chai').should();

kintone.schema.load();

describe('kintone.app.record', () => {
  before(() => kintone.fixture.load());

  describe('kintone.app.record.getId()', () => {
    describe('レコード詳細・編集・印刷画面', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('レコードIDが取得できること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '3' });
        assert.equal(kintone.app.record.getId(), '3');
      });
    });

    describe('レコード一覧画面', () => {
      const method = 'app.record.index.show';
      afterEach(() => kintone.events.off(method));

      it('nullが返ること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method);
        assert.isNull(kintone.app.record.getId());
      });
    });
  });

  describe('kintone.app.record.get()', () => {
    describe('レコード詳細・追加・編集・印刷画面', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('get()が取得できること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });
        const record = kintone.app.record.get();
        assert.equal(record.record['数値'].value, '99');
      });
    });

    describe('レコード一覧画面', () => {
      const method = 'app.record.index.show';
      afterEach(() => kintone.events.off(method));

      it('nullが返ること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method);
        assert.isNull(kintone.app.record.get());
      });
    });
  });

  describe('kintone.app.record.set()', () => {
    describe('レコード追加・編集画面', () => {
      const method = 'app.record.create.show';
      afterEach(() => kintone.events.off(method));

      it('set()で値が反映されること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });

        const record = kintone.app.record.get();
        record.record['数値'].value = '777';
        kintone.app.record.set(record);

        const actual = kintone.app.record.get();
        assert.equal(actual.record['数値'].value, '777');
      });
    });

    describe('レコード詳細画面', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('set()で値が反映されないこと', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });

        const record = kintone.app.record.get();
        record.record['数値'].value = '777';
        kintone.app.record.set(record);

        const actual = kintone.app.record.get();
        assert.equal(actual.record['数値'].value, '99');
      });
    });
  });

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      kintone.schema.load('.');
      kintone.fixture.load('.');
    });
    after(() => {
      kintone.schema.load();
      kintone.fixture.load();
    });

    describe('app.record.detail.show', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('kintone.app.record.get()がnullであること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });
        assert.isNull(kintone.app.record.get());
      });

      it('kintone.app.record.getId()がnullであること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '3' });
        assert.isNull(kintone.app.record.getId());
      });
    });
  });

  describe('getFieldElement', () => {
    describe('レコード詳細・印刷画面', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('ReferenceErrorになること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });
        (() => kintone.app.record.getFieldElement('数値')).should.throw(
          ReferenceError,
          'document is not defined',
        );
      });

      it('nullが返ること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });
        const actual = kintone.app.record.getFieldElement('存在しないフィールド');
        assert.isNull(actual);
      });
    });

    describe('レコード一覧画面', () => {
      const method = 'app.record.index.show';
      afterEach(() => kintone.events.off(method));

      it('nullが返ること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method);
        const actual = kintone.app.record.getFieldElement('数値');
        assert.isNull(actual);
      });
    });
  });

  describe('getSpaceElement', () => {
    describe('レコード詳細・印刷画面', () => {
      const method = 'app.record.detail.show';
      afterEach(() => kintone.events.off(method));

      it('ReferenceErrorになること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });
        (() => kintone.app.record.getSpaceElement('sp')).should.throw(
          ReferenceError,
          'document is not defined',
        );
      });

      it('nullが返ること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method, { recordId: '1' });
        const actual = kintone.app.record.getSpaceElement('存在しない要素ID');
        assert.isNull(actual);
      });
    });

    describe('レコード一覧画面', () => {
      const method = 'app.record.index.show';
      afterEach(() => kintone.events.off(method));

      it('nullが返ること', async () => {
        kintone.events.on(method, event => event);
        await kintone.events.do(method);
        const actual = kintone.app.record.getSpaceElement('sp');
        assert.isNull(actual);
      });
    });
  });
});

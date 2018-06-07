/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('record GET', () => {
  it('レコードが取得できること（コールバック）', async () => {
    let actual;
    await kintone.api(
      '/k/v1/record',
      'GET',
      { app: 2, id: 1 },
      (resp) => {
        actual = resp.record.数値.value;
      },
      (err) => {
        actual = err.message;
      },
    );
    assert.equal(actual, '99');
  });

  it('レコードが取得できること（kintone.Promise）', async () => {
    let actual;
    await kintone.api('/k/v1/record', 'GET', { app: 2, id: 1 }).then(
      (resolve) => {
        actual = resolve.record.数値.value;
      },
      (reject) => {
        actual = reject.message;
      },
    );
    assert.equal(actual, '99');
  });

  describe('URLが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/reco',
        'GET',
        { app: 2, id: 0 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid pathOrUrl');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/reco', 'GET', { app: 2, id: 0 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid pathOrUrl');
    });
  });

  describe('メソッドが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'DELETE',
        { app: 2, id: 0 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid method [DELETE]');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'DELETE', { app: 2, id: 0 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid method [DELETE]');
    });
  });

  describe('パラメータが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'GET',
        { app: 2, id: 0 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'GET', { app: 2, id: 0 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });
});

describe('url', () => {
  it('URLを取得できること', async () => {
    const actual = kintone.api.url('/k/v1/records');
    assert.equal(actual, 'https://dummy.cybozu.com/k/v1/records.json');
  });

  it('ゲストスペースURLを取得できること', async () => {
    const actual = kintone.api.url('/k/v1/records', true);
    assert.equal(actual, 'https://dummy.cybozu.com/k/guest/1/v1/records.json');
  });
});

describe('urlForGet', () => {
  it('URLを取得できること', async () => {
    const actual = kintone.api.urlForGet('/k/v1/records', {
      foo: 'bar',
      record: { key: ['val1', 'val2'] },
    });
    assert.equal(
      actual,
      'https://dummy.cybozu.com/k/v1/records.json?foo=bar&record.key[0]=val1&record.key[1]=val2',
    );
  });

  it('ゲストスペースURLを取得できること', async () => {
    const actual = kintone.api.urlForGet(
      '/k/v1/records',
      {
        foo: 'bar',
        record: { key: ['val1', 'val2'] },
        item: { item2: { item3: 4 } },
      },
      true,
    );
    assert.equal(
      actual,
      'https://dummy.cybozu.com/k/guest/1/v1/records.json?foo=bar&record.key[0]=val1&record.key[1]=val2&item.item2.item3=4',
    );
  });
});

describe('getConcurrencyLimit', () => {
  it('limit=0,running=0が返ること', async () => {
    const resolve = await kintone.api.getConcurrencyLimit();
    assert.deepEqual(resolve, { limit: 0, running: 0 });
  });
});

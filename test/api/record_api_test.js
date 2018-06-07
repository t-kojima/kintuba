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

  describe('appが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'GET',
        { app: 9, id: 1 },
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
      await kintone.api('/k/v1/record', 'GET', { app: 9, id: 1 }).then(
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

  describe('idが誤っている場合', () => {
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

describe('record POST', () => {
  afterEach(() => kintone.loadDefault());
  xit('レコードが登録できること（コールバック）', async () => {
    let actual;
    await kintone.api(
      '/k/v1/record',
      'POST',
      {
        app: 2,
        record: {
          文字列__1行: {
            value: 'ABC',
          },
        },
      },
      (resp) => {
        actual = resp;
      },
      (err) => {
        actual = err.message;
      },
    );
    assert.equal(actual, {
      id: '4',
      revision: '1',
    });
  });

  xit('レコードが登録できること（kintone.Promise）', async () => {
    let actual;
    await kintone.api('/k/v1/record', 'POST', { app: 2, id: 1 }).then(
      (resolve) => {
        actual = resolve;
      },
      (reject) => {
        actual = reject.message;
      },
    );
    assert.equal(actual, {
      id: '4',
      revision: '1',
    });
  });

  describe('appが誤っている場合', () => {
    it('レコードが登録できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'POST',
        { app: 9, id: 1 },
        (resp) => {
          actual = resp;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが登録できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'POST', { app: 9, id: 1 }).then(
        (resolve) => {
          actual = resolve;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });

  describe('recordが未設定の場合', () => {
    it('レコードが登録できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'POST',
        { app: 2 },
        (resp) => {
          actual = resp;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが登録できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'POST', { app: 2 }).then(
        (resolve) => {
          actual = resolve;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });
});

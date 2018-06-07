/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

// const getActual = async (id) => {
//   const method = 'app.record.index.edit.show';
//   kintone.events.on(method, event => event);
//   const event = await kintone.events.do(method, { recordId: id });
//   kintone.events.off(method);
//   return event.record;
// };

describe('record GET', () => {
  it('レコードが取得できること', async () => {
    let actual;
    await kintone.api(
      '/k/v1/record',
      'GET',
      { app: 2, id: 1 },
      (resp) => {
        actual = resp.record.数値.value;
      },
      () => {},
    );
    assert.equal(actual, '99');
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

/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('getConcurrencyLimit', () => {
  it('limit=0,running=0が返ること', async () => {
    const resolve = await kintone.api.getConcurrencyLimit();
    assert.deepEqual(resolve, { limit: 0, running: 0 });
  });
});

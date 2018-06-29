/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('proxy', () => {
  it('何も実行されないこと', async () => {
    const result = kintone.proxy(
      'pluginId',
      'http://example.com',
      'GET',
      {},
      {},
      () => assert.fail(),
      () => assert.fail(),
    );
    assert.isUndefined(result);
  });
});

describe('upload', () => {
  it('何も実行されないこと', async () => {
    const result = kintone.proxy.upload(
      'pluginId',
      'http://example.com',
      'GET',
      {},
      {},
      () => assert.fail(),
      () => assert.fail(),
    );
    assert.isUndefined(result);
  });
});

/* eslint-disable no-undef */
require('../../lib');
const { assert } = require('chai');

describe('getConfig', () => {
  it('nullが返ること', async () => {
    const actual = kintone.plugin.app.getConfig('pluginId');
    assert.isNull(actual);
  });
});

describe('setConfig', () => {
  it('callbackが実行されること', async () => {
    let actual;
    kintone.plugin.app.setConfig({}, () => {
      actual = true;
    });
    assert.isTrue(actual);
  });
});

describe('proxy', () => {
  it('何も実行されないこと', async () => {
    const result = kintone.plugin.app.proxy(
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

describe('getProxyConfig', () => {
  it('nullが返ること', async () => {
    const actual = kintone.plugin.app.getProxyConfig('http://example.com', 'GET');
    assert.isNull(actual);
  });
});

describe('setProxyConfig', () => {
  it('callbackが実行されること', async () => {
    let actual;
    kintone.plugin.app.setProxyConfig('http://example.com', 'GET', {}, {}, () => {
      actual = true;
    });
    assert.isTrue(actual);
  });
});

describe('upload', () => {
  it('何も実行されないこと', async () => {
    const result = kintone.plugin.app.proxy.upload(
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

/* eslint-disable no-undef */
require('../lib');
const schema = require('../lib/schema');
const fixture = require('../lib/fixture');
const { assert } = require('chai');

schema.load();
fixture.load();

describe('kintone関数', () => {
  it('UI Versionが2であること', () => {
    const actual = kintone.getUiVersion();
    assert.equal(actual, 2);
  });

  it('ログインユーザーが取得できること', () => {
    const actual = kintone.getLoginUser();
    assert.equal(actual.name, 'no-name');
  });
});

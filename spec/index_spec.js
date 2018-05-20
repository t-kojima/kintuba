/* eslint-disable no-undef */
require('../lib');

describe('kintone関数', () => {
  it('UI Versionが2であること', () => {
    const actual = kintone.getUiVersion();
    expect(actual).toBe(2);
  });

  it('ログインユーザーが取得できること', () => {
    const actual = kintone.getLoginUser();
    expect(actual.name).toEqual('no-name');
  });
});

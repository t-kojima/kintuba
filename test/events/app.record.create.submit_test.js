/* eslint-disable no-undef, no-param-reassign */
require('../../.');

describe('app.record.create.submit', () => {
  const method = 'app.record.create.submit';
  beforeEach(() => fixture.load());
  afterEach(() => kintone.events.off(method));

  xdescribe('フィールドの表示／非表示を切り替える', () => {});
});

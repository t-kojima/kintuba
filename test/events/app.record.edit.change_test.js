/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const fixture = require('../../lib/fixture');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.edit.change.<フィールド>', () => {
  const method = 'app.record.edit.change.数値';
  beforeEach(() => fixture.load());
  afterEach(() => kintone.events.off(method));

  describe('returnしない場合', () => {
    it('トリガーとなった値の変更がキャンセルされること', async () => {
      kintone.events.on(method, (event) => {
        event.record['文字列__複数行_'].value = 'DUMMY2';
      });
      await kintone.events.do(method, { recordId: '1', value: '999' });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
    });
  });
});

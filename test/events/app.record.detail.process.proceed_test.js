/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.detail.process.proceed', () => {
  const method = 'app.record.detail.process.proceed';
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, {
      recordId: '1',
      action: 'test',
      status: 'init',
      nextStatus: 'next',
    });
    assert.equal(event.type, method);
  });

  it('action,status,nextStatusが取得できること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method, {
      recordId: '1',
      action: 'test',
      status: 'init',
      nextStatus: 'next',
    });
    assert.equal(event.action.value, 'test');
    assert.equal(event.status.value, 'init');
    assert.equal(event.nextStatus.value, 'next');
  });

  it('idが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method, {
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      })
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'recordId option is required.'));
  });

  it('actionが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method, {
        recordId: '1',
        status: 'init',
        nextStatus: 'next',
      })
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'action option is required.'));
  });

  it('statusが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method, {
        recordId: '1',
        action: 'test',
        nextStatus: 'next',
      })
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'status option is required.'));
  });

  it('nextStatusが未指定の場合はErrorになること', async () => {
    kintone.events.on(method, event => event);
    await kintone.events
      .do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
      })
      .then(() => assert.fail())
      .catch(e => assert.equal(e.message, 'nextStatus option is required.'));
  });

  it('recordのフィールドを書き換えた時、値が反映されること', async () => {
    kintone.events.on(method, (event) => {
      event.record.数値.value = '999';
      return event;
    });
    await kintone.events.do(method, {
      recordId: '1',
      action: 'test',
      status: 'init',
      nextStatus: 'next',
    });

    const actual = await getActual('1');
    assert.equal(actual.数値.value, '999');
  });

  describe('return false', () => {
    xit('recordのフィールドを書き換えた時、値が反映されないこと', async () => {});
  });
  describe('returnしない場合', () => {
    xit('recordのフィールドを書き換えた時、値が反映されずにステータスのみ更新されること', async () => {});
  });
  describe('不正な値をreturnした場合', () => {
    xit('アクションがキャンセルされること', async () => {});
  });
});

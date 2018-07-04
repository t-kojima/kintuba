/* eslint-disable no-undef, no-param-reassign */
require('../../.');
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
  beforeEach(() => kintone.fixture.load());
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
    it('recordのフィールドを書き換えた時、値が反映されないこと', async () => {
      kintone.events.on(method, (event) => {
        event.record.数値.value = '999';
        return false;
      });
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
    });

    it('アクションがキャンセルされること', async () => {
      kintone.events.on(method, () => false);
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });

      const actual = await getActual('1');
      assert.equal(actual.ステータス.value, 'init');
    });
  });

  describe('returnしない場合', () => {
    it('recordのフィールドを書き換えた時、値が反映されずにステータスのみ更新されること', async () => {
      kintone.events.on(method, (event) => {
        event.record.数値.value = '999';
      });
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
      assert.equal(actual.ステータス.value, 'next');
    });
  });

  describe('不正な値をreturnした場合', () => {
    it('エラーが設定され、アクションがキャンセルされること', async () => {
      // 不正な値ってなんだろう…？
      kintone.events.on(method, (event) => {
        event.record.数値.value = '999';
        return 'INVALID VALUE';
      });
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });
      // assert.equal(event.error, 'ERROR MESSAGE');

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
      assert.equal(actual.ステータス.value, 'init');
    });
  });

  describe('errorプロパティを設定してreturnした場合', () => {
    it('アクションがキャンセルされること', async () => {
      // アラートは表示されない
      kintone.events.on(method, (event) => {
        event.error = 'ERROR MESSAGE';
        event.record.数値.value = '999';
        return event;
      });
      const event = await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });
      assert.equal(event.error, 'ERROR MESSAGE');

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
      assert.equal(actual.ステータス.value, 'init');
    });
  });

  describe('kintone.Promiseオブジェクトをreturnした場合', () => {
    it('非同期処理の実行を待ってイベントの処理を開始すること', async () => {
      kintone.events.on(method, event =>
        new kintone.Promise((resolve) => {
          resolve('999');
        }).then((response) => {
          event.record.数値.value = response;
          return event;
        }));
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });

      const actual = await getActual('1');
      assert.equal(actual.数値.value, '999');
    });

    it('thenしない場合は反映されない', async () => {
      kintone.events.on(
        method,
        event =>
          new kintone.Promise((resolve) => {
            event.record.数値.value = '999';
            resolve('999');
          }),
      );
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });
      const actual = await getActual('1');
      assert.equal(actual.数値.value, '99');
    });

    it('rejectをcatchできること', async () => {
      kintone.events.on(method, event =>
        new kintone.Promise((resolve, reject) => {
          reject('999');
        })
          .then(() => event)
          .catch((e) => {
            event.record.数値.value = e;
            return event;
          }));
      await kintone.events.do(method, {
        recordId: '1',
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });
      const actual = await getActual('1');
      assert.equal(actual.数値.value, '999');
    });
  });

  describe('.kintubaディレクトリが無い場合', () => {
    before(() => {
      kintone.schema.load('.');
      kintone.fixture.load('.');
    });
    after(() => {
      kintone.schema.load();
      kintone.fixture.load();
    });

    it('存在しないidを指定した場合、undefinedが取得されること', async () => {
      kintone.events.on(method, event => event);
      const event = await kintone.events.do(method, {
        recordId: 999,
        action: 'test',
        status: 'init',
        nextStatus: 'next',
      });
      assert.isUndefined(event.recordId);
      assert.isUndefined(event.record);
    });
  });
});

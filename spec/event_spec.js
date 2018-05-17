/* eslint-disable no-undef */
require('../lib');

describe('app.record.index.show event', () => {
  it('should be done', () => {
    let called = false;

    kintone.events.on('app.record.index.show', () => {
      called = true;
    });
    kintone.events.do('app.record.index.show');
    expect(called).toBeTruthy();
  });
});

#!/usr/bin/env node

const fixture = require('./../fixture');

const api = (pathOrUrl, method, params, callback, errback) => {
  if (pathOrUrl === '/k/v1/record') {
    if (method === 'GET') {
      const record = fixture.find(params.id.toString());
      if (record) {
        callback({ record });
      } else {
        errback({ message: 'レコードが存在しません' });
      }
    }
  }
};

api.url = (path, detectGuestSpace = false) =>
  (detectGuestSpace
    ? `https://dummy.cybozu.com/k/guest/1${path.replace(/\/k/, '')}.json`
    : `https://dummy.cybozu.com${path}.json`);

api.urlForGet = (path, params, detectGuestSpace = false) => {
  const getQuery = obj =>
    Object.keys(obj).reduce((result, key) => {
      if (Array.isArray(obj[key])) {
        result.push(...obj[key].map((a, i) => `${key}[${i}]=${a}`));
      } else if (obj[key] instanceof Object) {
        result.push(getQuery(obj[key]).map(a => `${key}.${a}`));
      } else {
        result.push(`${key}=${obj[key].toString()}`);
      }
      return result;
    }, []);
  const query = getQuery(params)
    .toString()
    .replace(/,/g, '&');
  return detectGuestSpace
    ? `https://dummy.cybozu.com/k/guest/1${path.replace(/\/k/, '')}.json?${query}`
    : `https://dummy.cybozu.com${path}.json?${query}`;
};

api.getConcurrencyLimit = () => new Promise(resolve => resolve({ limit: 0, running: 0 }));

module.exports = api;

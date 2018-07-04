const RecordApi = require('./record_api');

const api = (pathOrUrl, method, params, callback, errback) => {
  const apiobj = (() => {
    if (pathOrUrl === '/k/v1/record') {
      return new RecordApi(params);
    }
    return null;
  })();

  const done = (cb, eb) => {
    if (apiobj) {
      return apiobj.do(method, cb, eb);
    }
    return eb({ message: 'Invalid pathOrUrl' });
  };

  return callback && errback
    ? done(callback, errback)
    : new Promise((resolve, reject) => done(resolve, reject));
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

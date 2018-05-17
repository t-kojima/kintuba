const fetch = require('node-fetch');
const config = require('./config').load();

const url = `https://${config.domain}/k/v1/form.json?app=2`;
const headers = {
  'X-Cybozu-Authorization': Buffer.from(`${config.username}:${config.password}`).toString('base64'),
  Host: `${config.domain}:443`,
};

fetch(url, { headers })
  .then(res =>
    res.json().then(data => ({
      ok: res.ok,
      data,
    })))
  .then((res) => {
    if (!res.ok) {
      throw Error(res.data.message);
    } else {
      console.log(res.data);
    }
  });
// .catch(err => console.error(err));

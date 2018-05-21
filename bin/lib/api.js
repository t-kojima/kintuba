#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const config = require('./config');

const ENCODING = 'utf8';

exports.fetch = async () => {
  const {
    domain, app, username, password,
  } = await config.load();

  const fetchApi = async (method, param) => {
    const url = `https://${domain}/k/v1/${method}?${param}`;
    const headers = {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
      Host: `${domain}:443`,
    };

    const response = await fetch(url, { headers });
    const json = await response.json();
    if (!response.ok) {
      throw Error(json.message);
    } else {
      return JSON.stringify(json, null, '  ');
    }
  };

  const save = async (target, json) => {
    const filename = target.replace(/\//g, '_');
    await fs.mkdir('.kinmock', () => {});
    await fs.writeFile(`.kinmock/${filename}`, json, { encoding: ENCODING }, (err) => {
      if (err) throw err;
    });
  };

  const fetchWithSave = async (target, param) => {
    await fetchApi(target, param)
      .then(json => save(target, json))
      .then(() => {
        // eslint-disable-next-line no-console
        console.info(`Fetch api ${target}`);
      });
  };
  await fetchWithSave('app.json', `id=${app}`);
  await fetchWithSave('app/views.json', `app=${app}`);
  await fetchWithSave('form.json', `app=${app}`);
};

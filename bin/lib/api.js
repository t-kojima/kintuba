#!/usr/bin/env node

const fetch = require('node-fetch');

exports.fetch = async (config) => {
  const url = `https://${config.domain}/k/v1/form.json?app=2`;
  const headers = {
    'X-Cybozu-Authorization': Buffer.from(`${config.username}:${config.password}`).toString('base64'),
    Host: `${config.domain}:443`,
  };

  const response = await fetch(url, { headers });
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.message);
  } else {
    return JSON.stringify(json, null, '  ');
  }
};

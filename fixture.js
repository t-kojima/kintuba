const fs = require('fs');

const DIR_FIXTURE = '.kintuba/fixture';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults) => {
  try {
    return fs.readFileSync(filePath, ENCODING);
  } catch (err) {
    return defaults;
  }
};

exports.load = (dirname = DIR_FIXTURE) => {
  kintone.fixture.login.set(loadFile(`${dirname}/login.json`, {}));
  kintone.fixture.records.set(loadFile(`${dirname}/records.json`, []));
};

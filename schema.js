const fs = require('fs');

const DIR_SCHEMA = '.kintuba/schema';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults) => {
  try {
    return fs.readFileSync(filePath, ENCODING);
  } catch (err) {
    return defaults;
  }
};

exports.load = (dirname = DIR_SCHEMA) => {
  kintone.schema.app.set(loadFile(`${dirname}/app.json`, {}));
  kintone.schema.views.set(loadFile(`${dirname}/views.json`, {}));
  kintone.schema.fields.set(loadFile(`${dirname}/fields.json`, {}));
  kintone.schema.form.set(loadFile(`${dirname}/form.json`, {}));
};

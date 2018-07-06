const path = require('path');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '.'),
  },
};

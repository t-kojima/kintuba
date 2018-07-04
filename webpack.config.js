const path = require('path');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './lib/index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '.'),
  },
};

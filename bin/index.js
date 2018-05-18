const cac = require('cac');
const config = require('./lib/config');

const cli = cac();

cli.command('*', 'default', () => cli.showHelp());

cli.command('init', '設定ファイルの雛形を作成します', () => {
  config.create();
});

cli.command('create', 'フィクスチャの雛形を作成します', () => {});

cli.parse();

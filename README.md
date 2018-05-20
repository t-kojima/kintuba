# kinmock

[![Build Status](https://secure.travis-ci.org/t-kojima/kinmock.png?branch=master)](http://travis-ci.org/t-kojima/kinmock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Kinmock is mock for a unittest, it can use the kintone global object.

Kinmock は単体テストで利用できる**kintone**オブジェクトのモックです。

# Description

kinmock は`node.js`上で動作する**kintone**オブジェクトのモックです。kintone カスタマイズの JavaScript をローカル開発環境でテストする際に使用できます。

`document`へアクセスするコードをテストする場合は、karma プラグインを併せて利用して下さい。

https://github.com/t-kojima/karma-kinmock

# Warning

kinmockは`require`されるとグローバルの`kintone`オブジェクトを**上書き**します。（これはkintoneにアップロードするJavaScriptファイルをそのままテストできるようにする為です。）

ローカルでのテストでのみの使用とし、本番環境では使用しないで下さい。

# Install

```
$ npm install --save-dev kinmock
```

or

```
$ yarn add --dev kinmock
```

# Usage

テストコードで`require`して下さい。以後テストコード及びテスト対象コードで`kintone`オブジェクトが利用できます。

```javascript
require('kinmock')
```

## イベントの実行

kintoneでは画面の移動等でイベントが実行されますが、ローカル環境ではそのような動作ができませんので、kinmockではイベントを実行する関数を用意しています。

`kintone.events.on`でイベントを登録するのに対し、`kintone.events.do`でイベントを実行します。

```javascript
kintone.events.on('app.record.index.show', (event) => {
  console.log('event done');
});

kintone.events.do('app.record.index.show');

=> event done
```


## テストデータの利用

kintone REST API を利用してアプリの定義を取得し、レコードのデータを作成します。

```
$ npx kinmock init
```

or

```
$ yarn kinmock init
```

カレントディレクトリに`.kinmock.json`が作成されるので、各パラメータを設定します。

```
{
  "domain": "<subdomain>.cybozu.com",
  "app": <app id>,
  "username": "<username>",
  "password": "<password>"
}
```

設定したパラメータを使用し、kintone REST API からアプリ定義を取得します。

```
$ npx kinmock fetch
```

or

```
$ yarn kinmock fetch
```

`.kinmock`ディレクトリが作成され、以下のファイルが生成されます。

* fields.json
* views.json
* records.json

`records.json`へテストデータを登録します。

```json
{
  "records": [
    {
      "$id": {
        "type": "__ID__",
        "value": "<ここにテストデータを入力>"
      },
      "$revision": {
        "type": "__REVISION__",
        "value": "<ここにテストデータを入力>"
      },
      "文字列__1行_": {
        "type": "SINGLE_LINE_TEXT",
        "value": "<ここにテストデータを入力>"
      },
      "数値": {
        "type": "NUMBER",
        "value": "<ここにテストデータを入力>"
      }
    }
  ]
}
```

kinmockでテストデータが利用できます。

```javascript
kintone.events.on('app.record.index.show', (event) => {
    console.log(event.records[0]["文字列__1行_"].value);
});

=> 'テストデータ'
```

# examples



# Licence
MIT License.
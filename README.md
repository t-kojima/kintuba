# kintuba

[![Build Status](https://secure.travis-ci.org/t-kojima/kintuba.png?branch=master)](http://travis-ci.org/t-kojima/kintuba)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

kintuba is stub for a unittest, it can use the kintone global object.

kintuba は単体テストで利用できる**kintone**オブジェクトのスタブです。

## Description

kintuba は`node.js`上で動作する**kintone**オブジェクトのスタブです。kintone カスタマイズの JavaScript をローカル開発環境でテストする際に使用できます。

`document`へアクセスするコードをテストする場合は、karma プラグインを併せて利用して下さい。

[https://github.com/t-kojima/karma-kintuba](https://github.com/t-kojima/karma-kintuba)

## Warning

kintuba は`require`されるとグローバルの`kintone`オブジェクトを**上書き**します。（これは kintone にアップロードする JavaScript ファイルをそのままテストできるようにする為です。）

ローカルでのテストでのみの使用とし、本番環境では使用しないで下さい。

## Install

```bash
npm install --save-dev kintuba
```

or

```bash
yarn add --dev kintuba
```

## Usage

テストコードで`require`して下さい。以後テストコード及びテスト対象コードで`kintone`オブジェクトが利用できます。

```javascript
require('kintuba');
```

### イベントの実行

kintone では画面の移動等でイベントが実行されますが、ローカル環境ではそのような動作ができませんので、kintuba ではイベントを実行する関数を用意しています。

`kintone.events.on`でイベントを登録するのに対し、`kintone.events.do`でイベントを実行します。

```js
kintone.events.on('app.record.index.show', (event) => {
  console.log('event done');
});

kintone.events.do('app.record.index.show');

=> event done
```

また、レコード詳細画面を開いた場合など、特定の状況を表現する場合は`option`を指定します。

```js
kintone.events.on('app.record.detail.show', (event) => {
  console.log(event.record.$id.value);
});
kintone.events.do('app.record.detail.show', { recordId: '2' });

=> 2
```

尚、`kintone.events.do`は非同期で動作する点注意して下さい。

### テストデータの利用

kintuba を`require`しただけではデータが存在しない為、`event.records`などにアクセスしても空配列が返ってしまいます。テスト用のデータを取得できるようにする為には、以下の手順で予めテストデータを準備する必要があります。尚、以下の手順では`kintone REST API`を利用して対象アプリの情報を取得します。

#### kintone REST API 認証ファイルの作成

`kintuba init`コマンドで認証用テンプレートを作成します。

```bash
npx kintuba init
```

or

```bash
yarn kintuba init
```

カレントディレクトリに`.kintuba.json`が作成されるので、各パラメータを設定します。

```json
{
  "domain": "<subdomain>.cybozu.com",
  "app": "<app id>",
  "username": "<username>",
  "password": "<password>"
}
```

#### 対象アプリ情報の取得

作成した認証用ファイルを使用し、kintone REST API からアプリ情報を取得します。

```bash
npx kintuba fetch
```

or

```bash
yarn kintuba fetch
```

`.kintuba`ディレクトリが作成され、以下のファイルが生成されます。

* schema
  * app.json
  * fields.json
  * views.json
  * form.json
* fixture
  * login.json
  * records.json

`schema`ディレクトリは kintuba が利用するアプリの設定情報のファイルが生成されます。

`fixture`ディレクトリはテストデータ入力用のテンプレートが生成されます。

#### テストデータの入力

`fixture`ディレクトリのテンプレートへテストデータを登録します。

以下は`records.json`の登録例です。`value`にデータを入力します。

```json
[
  {
    "$id": {
      "type": "__ID__",
      "value": "1"
    },
    "$revision": {
      "type": "__REVISION__",
      "value": "1"
    },
    "文字列__1行_": {
      "type": "SINGLE_LINE_TEXT",
      "value": "テストデータ"
    },
    "数値": {
      "type": "NUMBER",
      "value": "99"
    }
  }
]
```

以上、`fixture`ディレクトリのファイルにテストデータを登録することで、kintubaのテストデータが利用できます。

```js
kintone.events.on('app.record.index.show', (event) => {
    console.log(event.records[0]["文字列__1行_"].value);
});

=> 'テストデータ'
```

## Licence

MIT License.

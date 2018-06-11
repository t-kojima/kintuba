# kintuba

[![Build Status](https://secure.travis-ci.org/t-kojima/kintuba.png?branch=master)](http://travis-ci.org/t-kojima/kintuba)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

kintuba is stub for a unittest, it can use the kintone global object.

## Description

kintuba は`node.js`上で動作する **kintone** オブジェクトのスタブモジュールです。kintone カスタマイズの JavaScript をローカル開発環境でテストする際に使用できます。

---

通常 kintone カスタマイズの JavaScript をテストしようとすると、kintone オブジェクトにアクセスできない為以下のエラーが発生します。

```js
ReferenceError: kintone is not defined
```

kintuba を使用すると、kintone オブジェクトのような振る舞いをしたり、予め用意したテストデータを kintone のデータのように扱ったりすることができます。

また、karma でブラウザを使用したテストをする場合は、karma プラグインを併せて利用して下さい。

[https://github.com/t-kojima/karma-kintuba](https://github.com/t-kojima/karma-kintuba)

## Warning

kintuba は`require`されるとグローバルの`kintone`オブジェクトを**上書き**します。（これは kintone にアップロードする JavaScript ファイルをそのままテストできるようにする為です。）

その為ローカルでのテストでのみの使用とし、本番環境では使用しないで下さい。

## Installation

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

kintone では画面の移動等でイベントが実行されますが、ローカル環境ではそのような動作ができませんので kintuba ではイベントを実行する関数を用意しています。

`kintone.events.on`でイベントを登録するのに対し、`kintone.events.do`でイベントを実行します。

```js
kintone.events.on('app.record.index.show', event => {
  console.log('event done');
});
kintone.events.do('app.record.index.show');

// => event done
```

また、レコード詳細画面を開いた場合など、特定の状況を表現する場合は`option`を指定します。

```js
kintone.events.on('app.record.detail.show', event => {
  console.log(event.record.$id.value);
});
kintone.events.do('app.record.detail.show', { recordId: '2' });

// => 2
```

尚、`kintone.events.do`は非同期で動作する点に注意して下さい。

### テストデータの利用

kintuba を`require`しただけではデータが存在しない為、event.records などにアクセスしても空配列が返ります。テストデータを返すようにするには、テストデータを用意し以下の手順で都度読み込んでください。また、テストデータの作成は[ここ](https://github.com/t-kojima/kintuba/blob/master/docs/Commands.md)を参考に行ってください。

#### schema

`kintone.schema.load()` を実行すると、`.kintuba/schema` ディレクトリにある以下のファイルを読み込みます。

* app.json
* fields.json
* form.json
* views.json

使用例）

```js
describe('example', () => {
  before(() => kintone.schema.load());
});
```

既定のディレクトリ（`.kintuba/schema`）以外にあるファイルを読みたい場合は引数で指定することができます。

```js
kintone.schema.load('other/dir');
// other/dir/app.json 等がロードされる
```

#### fixture

`kintone.fixture.load()`を実行すると、`.kintuba/fixture`ディレクトリにある以下のファイルを読み込みます。

* login.json
* records.json

また、既定のディレクトリ以外を読む場合は引数で指定します。

```js
kintone.fixture.load('other/dir');
// other/dir/login.json等がロードされる
```

## Licence

MIT License.

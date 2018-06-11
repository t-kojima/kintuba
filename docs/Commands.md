# Commands

## init

kintone REST API の認証に使用する設定ファイルのテンプレートを作成します。

```bash
kintuba init
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

## fetch

設定ファイルの情報を使用して kintone REST API からアプリ情報を取得します。

```bash
kintuba fetch [--schema]
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

`-s, --schema`オプションを指定すると schema のみ生成します。

## Usage

* `kintuba init`コマンドで`.kintuba.json`を作成し、認証用のパラメータを追記します。
* `kintuba fetch`コマンドで`.kintuba/schema`と`.kintuba/fixture`の各ファイルを作成します。
* `.kintuba/fixture`のテンプレートを基にテスト用データを作成します。  
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

* `kintone.schema.load()`及び`kintone.fixture.load()`でテストデータを読み込み、テスト内で利用することができます。

```js
kintone.fixture.load();

kintone.events.on('app.record.index.show', event => {
  console.log(event.records[0]['文字列__1行_'].value);
});

// => 'テストデータ'
```

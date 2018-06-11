# Index

kintone が持つ関数について、kintuba での挙動を説明します。

## kintone.getLoginUser

```js
kintone.getLoginUser();
```

- `fixture/login.json`のデータを返します。
- `fixture`データを load していない場合、undefined が返ります。

## kintone.getUiVersion

```js
kintone.getUiVersion();
```

- 2 が返ります。

## kintone.getRequestToken

この関数は実装されていません。

## kintone.schema.load

これは kintuba **独自の関数** です。

```js
kintone.schema.load(dirname);
```

- `dirname`以下のファイルを schema オブジェクトに読み込みます。
  - `<dirname>/app.json`
  - `<dirname>/fields.json`
  - `<dirname>/form.json`
  - `<dirname>/views.json`
- 引数を指定しない場合、`.kintuba/schema`以下のファイルを読み込みます。

## kintone.fixture.load

これは kintuba **独自の関数** です。

```js
kintone.fixture.load(dirname);
```

- `dirname`以下のファイルを fixture オブジェクトに読み込みます。
  - `<dirname>/login.json`
  - `<dirname>/records.json`
- 引数を指定しない場合、`.kintuba/fixture`以下のファイルを読み込みます。

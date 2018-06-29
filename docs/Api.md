# api

kintone.api が持つ関数について、kintuba での挙動を説明します。

## kintone.api

```js
kintone.api(pathOrUrl, method, params, opt_callback, opt_errback);
```

- kintone REST API は実行しません。
- 非同期関数です。

以下の path と method の組み合わせのみ実装されています。

| path         | method | 動作               |
| ------------ | ------ | ------------------ |
| /k/v1/record | GET    | 指定レコードの取得 |
| /k/v1/record | POST   | 新規レコードの登録 |

## kintone.api.url

```js
kintone.api.url(path, opt_detectGuestSpace);
```

- サブドメインは **dummy** 固定です。
- ゲストスペースの ID は **1** 固定です。

path が`/k/v1/records`の場合、`https://dummy.cybozu.com/k/v1/records.json` を返します。

opt_detectGuestSpace が true の場合、`https://dummy.cybozu.com/k/guest/1/v1/records.json` を返します。

## kintone.api.urlForGet

```js
kintone.api.urlForGet(path, params, opt_detectGuestSpace);
```

- サブドメインは**dummy**固定です。
- ゲストスペースの ID は**1**固定です。

path が`/k/v1/records`、param が`{app: 4,fields: ["record_no"]}`の場合、`https://dummy.cybozu.com/k/v1/records.json?app=4&fields[0]=record_no` を返します。

opt_detectGuestSpace が true の場合、`https://dummy.cybozu.com/k/guest/1/v1/records.json?app=4&fields[0]=record_no` を返します。

## getConcurrencyLimit

```js
kintone.api.getConcurrencyLimit();
```

- 非同期関数です。
- kintone.Promise オブジェクトを返し、値は常に`{ limit: 0, running: 0 }`です。

# app

kintone.app が持つ関数について、kintuba での挙動を説明します。

## kintone.app.record.getId

```js
kintone.app.record.getId();
```

- `kintone.events.do`関数でイベントを発火した時、指定した`recordId`を返します。
- レコードが存在しない場合や、許可されない画面の場合は`null`を返します。

## kintone.app.record.get

```js
kintone.app.record.get();
```

- `kintone.events.do`関数でイベントを発火した時、指定した`recordId`のレコードデータを返します。
- レコードが存在しない場合や、許可されない画面の場合は`null`を返します。

## kintone.app.record.set

```js
kintone.app.record.set(record);
```

- `kintone.events.do`関数でイベントを発火した時、指定した`recordId`のレコードデータを上書きします。
- 許可されない画面の場合は上書きを行いません。

## kintone.app.record.setFieldShown

```js
kintone.app.setFieldShown(fieldCode, isShown);
```

- この関数は何も行いません。

## kintone.app.record.setGroupFieldOpen

```js
kintone.app.record.setGroupFieldOpen(fieldCode, isOpen);
```

- この関数は何も行いません。

## kintone.app.getQueryCondition

```js
kintone.app.getQueryCondition();
```

- `kintone.events.do`関数でイベントを発火した時、指定した`viewId`の絞り込み条件を返します。
- 絞り込み条件が無い場合は空文字列を返します。
- `schema`データを load していない場合や、許可されない画面の場合は`null`を返します。

## kintone.app.getQuery

```js
kintone.app.getQuery();
```

- `kintone.app.getQueryCondition`と同じ結果を返します。
- ソート順（order by）、表示件数（limit）、位置（offset）は返しません。

## kintone.app.getId

```js
kintone.app.getId();
```

- `schema/app.json`の appId を返します。
- `schema`データを load していない場合や、`schema/app.json`に appId が存在しない場合は`null`を返します。

## kintone.app.getLookupTargetAppId

```js
kintone.app.getLookupTargetAppId(fieldCode);
```

- `schema/fields.json`のルックアップフィールド定義にある参照先 appId を返します。
- `schema`データを load していない場合や、指定したフィールドが存在しない、またはルックアップフィールドではない場合は`null`を返します。

## kintone.app.getRelatedRecordsTargetAppId

```js
kintone.app.getRelatedRecordsTargetAppId(fieldCode);
```

- `schema/fields.json`の関連レコード一覧にある参照先 appId を返します。
- `schema`データを load していない場合や、指定したフィールドが存在しない、または関連レコード一覧ではない場合は`null`を返します。

## kintone.app.record.getFieldElement

```js
kintone.app.record.getFieldElement(fieldCode);
```

- `schema/fields.json`に指定したフィールドがある場合、`document.body`の子要素に`<div></div>`を追加し、追加した要素を返します。
- `schema`データを load していない場合や、指定したフィールドが存在しない、または許可されない画面の場合は`null`を返します。

## kintone.app.record.getHeaderMenuSpaceElement

```js
kintone.app.record.getHeaderMenuSpaceElement();
```

- `document.body`を返します。

## kintone.app.record.getSpaceElement

```js
kintone.app.record.getSpaceElement(id);
```

- `schema/form.json`に指定したスペースフィールドの要素 ID がある場合、`document.body`の子要素に`<div></div>`を追加し、追加した要素を返します。
- `schema`データを load していない場合や、指定したスペースフィールドの要素 ID が存在しない、または許可されない画面の場合は`null`を返します。

## kintone.app.getFieldElements

```js
kintone.app.getFieldElements(fieldCode);
```

- `schema/fields.json`に指定したフィールドがある場合、`document.body`の子要素に`<div></div>`をレコード件数分追加し、追加した要素の配列を返します。
- `fixture`データを load していない場合や、レコードデータが 0 件の場合は空配列を返します。
- `schema`データを load していない場合や、指定したフィールドが存在しない、または許可されない画面の場合は`null`を返します。

## kintone.app.getHeaderMenuSpaceElement

```js
kintone.app.getHeaderMenuSpaceElement();
```

- `document.body`を返します。
- 許可されない画面の場合は`null`を返します。

## kintone.app.getHeaderSpaceElement

```js
kintone.app.getHeaderSpaceElement();
```

- `document.body`を返します。
- 許可されない画面の場合は`null`を返します。

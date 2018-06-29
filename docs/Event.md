# Index

kintone.events が持つ関数、及びイベントについて、kintuba での挙動を説明します。

## kintone.events.on

```js
kintone.events.on(event, handler(event));
```

- 指定したイベントタイプへイベントハンドラを登録します。

## kintone.events.off

```js
kintone.events.off(event);
```

- 指定したイベントタイプの全てのイベントハンドラを削除します。
- 戻り値はありません（undefined）※true/false を返すよう修正予定
- 特定のイベントハンドラを指定した削除は行うことができません。

```js
kintone.events.off();
```

- 全てのイベントハンドラを削除します。
- kintuba が内部で使用しているイベントハンドラも削除してしまう為、使用しないでください。※使用できるよう修正予定

## kintone.events.do

これは kintuba **独自の関数** です。

```js
kintone.events.do(event, options);
```

- `kintone.events.on`で登録したイベントを発火させます。
- `options`は特定の状況を表現する際に設定します。
- これは非同期関数です。
- kintone.Promise オブジェクトを返します。
- 存在しないイベントタイプで実行した場合や、イベントハンドラで return しない場合は undefined が返ります。
- イベントハンドラで`null`を return した場合は`null`が返ります。

## イベント

### app.record.index.show

```js
kintone.events.on('app.record.index.show', {
  viewId: 20,
  date: '201801',
  offset: 1,
  limit: 1,
});
```

- `viewId` `date` `offset` `limit` は全て任意のオプションです。ただし、カレンダーの`viewId`を指定した場合、`date`は必須になります。
- `viewId`が未指定の場合、デフォルト値 20 が適用されます。
- イベントハンドラでレコード情報を書き換えた場合、反映されません。

### app.record.index.edit.show

```js
kintone.events.on('app.record.index.edit.show', { recordId: 1 });
```

- オプションとして`recordId`が必須です。
- `fixture`データを load していない場合、イベントは発火するがプロパティは undefined となります。
- イベントハンドラでレコード情報を書き換えた場合、反映されません。

### app.record.index.edit.change.<フィールドコード>

```js
kintone.events.on('app.record.index.edit.change.<フィールドコード>', {
  recordId: 1,
  value: 'changes.field.value',
});
```

- オプションとして`recordId` `value`が必須です。
- `schema`データを load していない場合、イベントは発火しません。
- `fixture`データを load していない場合、イベントは発火するがプロパティは undefined となります。
- イベントハンドラでレコード情報を書き換えた場合、`event`オブジェクトを return することでレコード情報が更新されます。
- `false`を return した場合、もしくは return しない場合はレコード情報を更新しません。
- トリガーとなった値（`value`）の変更はキャンセルされません。

### app.record.index.edit.submit

```js
kintone.events.on('app.record.index.edit.submit', { recordId: 1 });
```

- オプションとして`recordId`が必須です。
- `fixture`データを load していない場合、イベントは発火するがプロパティは undefined となります。
- イベントハンドラでレコード情報を書き換えた場合、`event`オブジェクトを return することでレコード情報が更新されます。
- `false`を return した場合、もしくは return しない場合はレコード情報を更新しません。
- kintone.Promise を return した場合、非同期処理を実行してからレコードの更新を行います。

### app.record.index.edit.submit.success

```js
kintone.events.on('app.record.index.edit.submit.success', { recordId: 1 });
```

- オプションとして`recordId`が必須です。
- `fixture`データを load していない場合、イベントは発火するがプロパティは undefined となります。
- イベントハンドラでレコード情報を書き換えた場合、反映されません。
- kintone.Promise を return した場合、非同期処理を実行してからイベントを実行します。
- `url`プロパティを設定しても画面遷移は行いません。

### app.record.index.delete.submit

```js
kintone.events.on('app.record.index.delete.submit', { recordId: 1 });
```

- オプションとして`recordId`が必須です。
- `fixture`データを load していない場合、何も起こりません。
- イベントハンドラで`false`を return した場合、レコードは削除されません。
- kintone.Promise を return した場合、非同期処理を実行してからレコードの削除を行います。

### app.record.detail.show

```js
kintone.events.on('app.record.detail.show', { recordId: 1 });
```

- `app.record.index.edit.show`と同一の動作をします。

### app.record.detail.delete.submit

```js
kintone.events.on('app.record.detail.delete.submit', { recordId: 1 });
```

- `app.record.index.delete.submit`と同一の動作をします。

### app.record.detail.process.proceed

```js
kintone.events.on('app.record.detail.process.proceed', {
  recordId: 1,
  action: 'test',
  status: 'init',
  nextStatus: 'next',
});
```

- オプションとして、`recordId` `action` `status` `nextStatus`が必須です。
- `fixture`データを load していない場合、イベントは発火するがプロパティは undefined となります。
- イベントハンドラでレコード情報を書き換えた場合、`event`オブジェクトを return することでレコード情報が更新されます。
- `false`を return すると書き換えたレコード情報とアクションがキャンセルされます。
- `event.error`を設定して return すると書き換えたレコード情報とアクションがキャンセルされますが、alert は表示されません。
- `event`オブジェクト、`false`、`undefined`以外を return した場合、レコード情報とアクションがキャンセルされますが、エラー等は表示されません。
- イベントハンドラで return しない場合、ステータスのみが更新されます。
- kintone.Promise を return した場合、非同期処理を実行してからレコードの更新を行います。
- `action` `status` `nextStatus`は`schema`の定義を参照しない為、存在しないアクション・ステータスを指定しても問題なく動作します。

### app.record.create.show

```js
kintone.events.on('app.record.create.show', { recordId: 1 });
```

- オプションとして`recordId`が必須です。
- `fixture`データを load していない場合、イベントは発火するがプロパティは undefined となります。
- イベントハンドラでレコード情報を書き換えた場合、`event`オブジェクトを return することでレコード情報が更新されます。
- `false`を return した場合、もしくは return しない場合はレコード情報を更新しません。
- `reuse`プロパティはデフォルトで false を返します。

### app.record.create.change.<フィールドコード>

```js
kintone.events.on('app.record.create.change.<フィールドコード>', {
  recordId: 1,
  value: 'changes.field.value',
});
```

- `app.record.index.edit.change.<フィールドコード>`と同一の動作をします。

### app.record.create.submit

```js
kintone.events.on('app.record.create.submit', { recordId: 1 });
```

- `app.record.index.edit.submit`と同一の動作をします。

### app.record.create.submit.success

```js
kintone.events.on('app.record.create.submit.success', { recordId: 1 });
```

- `app.record.index.edit.submit.success`と同一の動作をします。

### app.record.edit.show

```js
kintone.events.on('app.record.edit.show', { recordId: 1 });
```

- `app.record.create.show`と同一の動作をします。

### app.record.edit.change.<フィールドコード>

```js
kintone.events.on('app.record.edit.change.<フィールドコード>', {
  recordId: 1,
  value: 'changes.field.value',
});
```

- `false`を return した場合、もしくは return しない場合はレコード情報を更新しませんし、トリガーとなった値（`value`）の変更もキャンセルされます。
- それ以外は`app.record.index.edit.change.<フィールドコード>`と同一の動作をします。

### app.record.edit.submit

```js
kintone.events.on('app.record.edit.submit', { recordId: 1 });
```

- `app.record.index.edit.submit`と同一の動作をします。

### app.record.edit.submit.success

```js
kintone.events.on('app.record.edit.submit.success', { recordId: 1 });
```

- `app.record.index.edit.submit.success`と同一の動作をします。

### app.record.print.show

```js
kintone.events.on('app.record.print.show');
```

- `app.record.index.edit.show`と同一の動作をします。

### app.report.show

```js
kintone.events.on('app.report.show');
```

- このイベントは何も実行しません。

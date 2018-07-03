# Plugin

kintone.plugin が持つ関数について、kintuba での挙動を説明します。

## kintone.plugin.app.getConfig

```js
kintone.plugin.app.getConfig('pluginId');
```

- `pluginId`に関わらず null が返ります。

## kintone.plugin.app.setConfig

```js
kintone.plugin.app.setConfig(config, callback);
```

- 戻り値はありません。
- この関数は何も実行しませんが、`callback`は実行されます。

## kintone.plugin.app.proxy

```js
kintone.plugin.app.proxy(pluginId, url, method, headers, data, callback, error);
```

- この関数は何も実行しません。

## kintone.plugin.app.getProxyConfig

```js
kintone.plugin.app.getProxyConfig(url, method);
```

- `url`、`method`に関わらず null が返ります。

## kintone.plugin.app.setProxyConfig

```js
kintone.plugin.app.setProxyConfig(url, method, headers, data, callback);
```

- 戻り値はありません。
- この関数は何も実行しませんが、`callback`は実行されます。

## kintone.plugin.app.proxy.upload

```js
kintone.plugin.app.proxy.upload(
  pluginId,
  url,
  method,
  headers,
  data,
  callback,
  error
);
```

- この関数は何も実行しません。

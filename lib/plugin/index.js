const plugin = {
  app: {
    getConfig: () => null,
    setConfig: (config, callback) => {
      if (callback) callback();
    },
    getProxyConfig: () => null,
    setProxyConfig: (url, method, headers, data, callback) => {
      if (callback) callback();
    },
    proxy() {},
  },
};

plugin.app.proxy.upload = () => {};

module.exports = plugin;

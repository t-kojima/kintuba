const app = {
  getId: () => 1,
  getHeaderMenuSpaceElement: () => document.body
}

global.kintone = {
  app: app,
  events: {
    on: (key, callback) => {
      if (key === 'app.record.index.show') {
        callback('events')
      }
    }
  }
}

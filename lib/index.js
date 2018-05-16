const app = {
  getId: () => 1,
  getHeaderMenuSpaceElement: () => document.body
}

module.exports = {
  app: app,
  events: {
    on: (key, callback) => {
      if (key === 'app.record.index.show') {
        callback('events')
      }
    }
  }
}

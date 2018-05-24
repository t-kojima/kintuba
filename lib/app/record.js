#!/usr/bin/env node

module.exports = class Record {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  getId() {
    const allows = ['app.record.detail', 'app.record.edit', 'app.record.print'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    return this.data && isAllow() ? this.data.$id.value : null;
  }

  get() {
    const allows = [
      'app.record.detail',
      'app.record.create',
      'app.record.edit',
      'app.record.print',
    ];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    return this.data && isAllow() ? { record: this.data } : null;
  }

  set(data) {
    const allows = ['app.record.create', 'app.record.edit'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow()) {
      this.data = data;
    }
  }
};

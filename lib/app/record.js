#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this, no-unused-vars */

const schema = require('./../schema');

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
    return this.data && isAllow() ? JSON.parse(JSON.stringify({ record: this.data })) : null;
  }

  set(data) {
    const allows = ['app.record.create', 'app.record.edit'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow()) {
      this.data = JSON.parse(JSON.stringify(data.record));
    }
  }

  setFieldShown(fieldCode, isShown) {
    // 何もしない
  }

  setGroupFieldOpen(fieldCode, isOpen) {
    // 何もしない
  }

  getFieldElement(fieldCode) {
    const allows = ['app.record.detail', 'app.record.print'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow() && schema.fields.properties) {
      if (schema.fields.properties[fieldCode]) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        return div; // 空divを返す
      }
    }
    return null;
  }

  getHeaderMenuSpaceElement() {
    return document.body; // bodyを返す
  }

  getSpaceElement(id) {
    const allows = [
      'app.record.detail',
      'app.record.create',
      'app.record.edit',
      'app.record.print',
    ];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow() && schema.form.properties) {
      const target = Object.keys(schema.form.properties).find((key) => {
        const prop = schema.form.properties[key];
        return prop.type === 'SPACER' && prop.elementId === id;
      });
      if (target) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        return div; // 空divを返す
      }
    }
    return null;
  }
};

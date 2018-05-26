#!/usr/bin/env node

const schema = require('./../schema');
const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

const EDIT_DISALLOWS = [
  'RECORD_NUMBER',
  'CREATOR',
  'CREATED_TIME',
  'MODIFIER',
  'UPDATED_TIME',
  'STATUS',
  'STATUS_ASSIGNEE',
  'CALC',
  'FILE',
];

module.exports = class RecordChangeEventObject extends RecordEventObject {
  constructor(event, options = {}, type) {
    super(event, options);

    if (options.value === undefined) throw new Error('value option is required.');

    this.changes = {
      field: {
        type,
        value: options.value,
      },
      row: {},
    };
  }

  done() {
    const key = (() => {
      const keys = this.type.split('.');
      return keys[keys.length - 1];
    })();

    const isDisallows = () => EDIT_DISALLOWS.some(a => a === this.changes.field.type);

    const isAutoCalc = () =>
      this.changes.field.type === 'SINGLE_LINE_TEXT' && schema.fields.properties[key].expression;

    const isLookup = () =>
      (this.changes.field.type === 'SINGLE_LINE_TEXT' || this.changes.field.type === 'NUMBER') &&
      schema.fields.properties[key].lookup;

    const isLookupMapping = () => {
      const mappings = Object.keys(schema.fields.properties)
        .filter(k =>
          schema.fields.properties[k].lookup && schema.fields.properties[k].lookup.fieldMappings)
        .map(k => schema.fields.properties[k].lookup.fieldMappings);
      return mappings.some(a => a.some(b => b.field === key));
    };

    // 編集非許可のフィールド or 文字列かつ自動計算 or ルックアップ or ルックアップコピー先 は編集不可
    if (isDisallows() || isAutoCalc() || isLookup() || isLookupMapping()) return;

    if (this.changes.field.type === 'RADIO_BUTTON' && this.changes.field.value === '') {
      // ラジオボタンフィールドで空文字列を指定した場合、初期値の選択肢となります。
      this.record[key].value = schema.fields.properties[key].defaultValue;
    } else {
      this.record[key].value = this.changes.field.value;
    }
    fixture.update(this.record);
  }

  static get TYPES() {
    return [
      'RADIO_BUTTON',
      'DROP_DOWN',
      'CHECK_BOX',
      'MULTI_SELECT',
      'USER_SELECT',
      'ORGANIZATION_SELECT',
      'GROUP_SELECT',
      'DATE',
      'TIME',
      'DATETIME',
      'SINGLE_LINE_TEXT',
      'NUMBER',
      'SUBTABLE',
    ];
  }
};

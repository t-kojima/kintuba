#!/usr/bin/env node

const schema = require('./../schema');
const fixture = require('./../fixture');
const EventObject = require('./event_object');

module.exports = class RecordEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    if (!options.recordId) throw new Error('recordId option is required.');

    const copy = fixture.records.find(a => a.$id.value === options.recordId);
    if (copy) {
      const record = JSON.parse(JSON.stringify(copy));
      this.recordId = record.$id.value;
      this.record = record;
    }
  }

  rollbackDisallowFields() {
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

    const isDisallows = key => EDIT_DISALLOWS.some(a => a === schema.fields.properties[key].type);

    const isAutoCalc = key =>
      schema.fields.properties[key].type === 'SINGLE_LINE_TEXT' &&
      schema.fields.properties[key].expression;

    const isLookup = key =>
      (schema.fields.properties[key].type === 'SINGLE_LINE_TEXT' ||
        schema.fields.properties[key].type === 'NUMBER') &&
      schema.fields.properties[key].lookup;

    const isLookupMapping = (key) => {
      const mappings = Object.keys(schema.fields.properties)
        .filter(k =>
          schema.fields.properties[k].lookup && schema.fields.properties[k].lookup.fieldMappings)
        .map(k => schema.fields.properties[k].lookup.fieldMappings);
      return mappings.some(a => a.some(b => b.field === key));
    };

    const hasSchema = key => Object.keys(schema.fields.properties).some(a => a === key);

    if (this.record) {
      Object.keys(this.record)
        .filter(key => hasSchema(key))
        .forEach((key) => {
          // 編集非許可のフィールド or 文字列かつ自動計算 or ルックアップ or ルックアップコピー先 は編集不可
          if (isDisallows(key) || isAutoCalc(key) || isLookup(key) || isLookupMapping(key)) {
            this.record[key].value = fixture.find(this.recordId)[key].value;
          }
          // ラジオボタンフィールドで空文字列を指定した場合、初期値の選択肢になる
          if (
            schema.fields.properties[key].type === 'RADIO_BUTTON' &&
            this.record[key].value === ''
          ) {
            this.record[key].value = schema.fields.properties[key].defaultValue;
          }
        });
    }
  }
};

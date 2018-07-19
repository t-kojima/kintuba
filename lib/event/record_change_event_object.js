// record.index.edit.change.<field>
// record.edit.change.<field>
// record.create.change.<field>

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

const getKey = type => {
  const keys = type.split('.');
  return keys[keys.length - 1];
};

module.exports = class RecordChangeEventObject extends RecordEventObject {
  constructor(event, options = {}, type, triggerNotCancel) {
    super(event, options);

    if (options.value === undefined)
      throw new Error('value option is required.');

    this.changes = {
      field: {
        type,
        value: options.value,
      },
      row: {},
    };

    if (triggerNotCancel && this.record) {
      this.record[getKey(this.type)].value = options.value;
      this.rollbackDisallowFields();
      fixture.update(this.record);
    }
  }

  done() {
    if (this.record) {
      this.record[getKey(this.type)].value = this.changes.field.value;
      this.rollbackDisallowFields();
      fixture.update(this.record);
    }
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

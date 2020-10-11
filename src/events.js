var bus = {
  listeners: {},

  trigger: function(name, data) {
    if (this.listeners[name] === undefined) {
      return;
    }

    for (var i = 0; i < this.listeners[name].length; i++) {
      this.listeners[name][i](data);
    }
  },

  addEventListener: function(name, callback) {
    if (this.listeners[name] === undefined) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(callback);
  },

  removeEventListener: function(name, callback) {
    if (this.listeners[name] === undefined) {
      return;
    }

    var index = this.listeners[name].indexOf(callback);
    if (index === -1) {
      return index;
    }

    this.listeners[name].splice(index, 1);
    return index;
  }
};

var types = {
  OSCILLATOR_CHANGE: 'OSCILLATOR_CHANGE',
  SEQUENCER_CHANGE: 'SEQUENCER_CHANGE',
};

module.exports = {
  Bus: bus,
  Types: types,
};

var bus = {
  listeners: {},
  addEventListener: function(name, callback) {
    if (listeners[name] === undefined) {
      listeners[name] = [];
    }

    listeners[name].push(callback);
  },

  removeEventListener: function(name, callback) {
    if (listeners[name] === undefined) {
      return;
    }

    var index = listeners[name].indexOf(callback);
    if (index === -1) {
      return index;
    }

    listeners[name].splice(index, 1);
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

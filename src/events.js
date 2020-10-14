/**
 * @module NES.Events.Bus
 */
var bus = {
  listeners: {},

  /**
   * Triggers an event
   * @param {String} name The name of the event to trigger
   * @param {Object} data The data to emit with the event
   */
  trigger: function (name, data) {
    if (this.listeners[name] === undefined) {
      return
    }

    for (var i = 0; i < this.listeners[name].length; i++) {
      this.listeners[name][i](data)
    }
  },

  /**
   * Registers an event listener
   * @param {String} name The event to listen to
   * @param {Function} callback The function to call when the event is emitted
   */
  addEventListener: function (name, callback) {
    if (this.listeners[name] === undefined) {
      this.listeners[name] = []
    }

    this.listeners[name].push(callback)
  },

  /**
   * Removes a registered event listener
   * @param {String} name The event the listener is attached to
   * @param {Function} callback The function to remove
   */
  removeEventListener: function (name, callback) {
    if (this.listeners[name] === undefined) {
      return
    }

    var index = this.listeners[name].indexOf(callback)
    if (index === -1) {
      return index
    }

    this.listeners[name].splice(index, 1)
    return index
  }
}

var types = {
  OSCILLATOR_CHANGE: 'OSCILLATOR_CHANGE',
  SEQUENCER_TICK: 'SEQUENCER_TICK'
}

/**
 * Utilities for emitting events
 * @module NES.Events
 */
module.exports = {
  /**
   * An event bus that the sequencer uses to emit events
   * @module NES.Events.Bus
   */
  Bus: bus,

  /**
   * An enum of event types that get emitted
   * @module NES.Events.Types
   */
  Types: types
}

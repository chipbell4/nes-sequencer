var { Bus, Types } = require('./events')
var Oscillators = require('./oscillators')

var CYCLE_LENGTH_IN_MS = 1000 / 60
var sequencerInterval = null

var calculateStartCyclesForMelody = function (melody) {
  var currentStartCycle = 0

  return melody.map(function (note) {
    var newNote = {
      frequency: note.frequency,
      volume: note.volume,
      cycles: note.cycles,
      start_cycle: currentStartCycle
    }

    currentStartCycle += note.cycles

    return newNote
  })
}

var initializePitches = function (melodies) {
  Object.keys(melodies).forEach(function (key) {
    Oscillators.setPitch(key, melodies[key][0].frequency, melodies[key][0].volume)
  })
}

/**
 * Handles the sequencing of songs
 * @module NES.Sequencer
 */
module.exports = {
  /**
   * Schedules a melody to be played. melodies, in this case is an object, where the keys are the oscillator type
   * ('PWM1', 'PWM2', 'NOISE', 'TRIANGLE'), and the associated values is an array of objects, each looking like this:
   * { frequency: 440, volume: 0.2, cycles: 10 }, where frequency is in Hz, volume ranges between 0 and 1, and cycles
   * is the number of cpu cycles to use
   * @param {Array} melodies The melody to play
   * @param {Boolean} loop Whether or not to loop the song. Defaults to false
   */
  play: function (melodies, loop) {
    loop = loop || false

    this.stop()

    initializePitches(melodies)

    // calculate the cycle length and start cycle for each melody note
    Object.keys(melodies).forEach(function (key) {
      melodies[key] = calculateStartCyclesForMelody(melodies[key])
    })

    // calculate the last cycle for song, so we can loop if necessary
    var lastCycle = 0
    Object.keys(melodies).forEach(function (key) {
      var localLastCycle = Math.max.apply(Math, melodies[key].map(note => note.start_cycle + note.cycles))
      lastCycle = Math.max(localLastCycle, lastCycle)
    })

    var currentCycle = 0
    sequencerInterval = setInterval(function () {
      Bus.trigger(Types.SEQUENCER_TICK, { currentCycle })
      Object.keys(melodies).forEach(function (oscillatorType) {
        // find the note that should be playing (based on current cycle), and play it
        melodies[oscillatorType]
          .filter(function (note) {
            return note.start_cycle === currentCycle
          })
          .forEach(function (note) {
            Oscillators.setPitch(oscillatorType, note.frequency, note.volume)
          })
      })

      currentCycle += 1

      if (loop && currentCycle >= lastCycle) {
        currentCycle = 0
      }
    }, CYCLE_LENGTH_IN_MS)
  },

  /**
   * Stops all songs, and mutes them
   */
  stop: function () {
    clearInterval(sequencerInterval)

    // mute everything
    var oscillatorTypes = ['PWM1', 'PWM2', 'TRIANGLE', 'NOISE']
    oscillatorTypes.forEach(function (oscillator) {
      Oscillators.setPitch(oscillator, 440, 0)
    })
  },

  CYCLE_LENGTH_IN_MS: CYCLE_LENGTH_IN_MS
}

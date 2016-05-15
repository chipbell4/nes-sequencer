var Oscillators = require('./oscillators')

var CYCLE_LENGTH_IN_MS = Math.round(1000 / 60)
var sequencerInterval = null

var convertDurationsToCycles = function (melody) {
  return melody.map(function (note) {
    return { frequency: note.frequency, volume: note.volume, cycles: Math.round(note.duration / CYCLE_LENGTH_IN_MS) }
  });
}

var calculateStartCyclesForMelody = function (melody) {
  var currentStartCycle = 0
  melody.forEach(function (note) {
    note.start_cycle = currentStartCycle
    currentStartCycle += note.cycles
  })

  return melody
}

var initializePitches = function (melodies) {
  Object.keys(melodies).forEach(function (key) {
    Oscillators.setPitch(key, melodies[key][0].frequency, melodies[key][0].volume)
  })
}

module.exports = {
  /**
   * Schedules a melody to be played. melodies, in this case is an object, where the keys are the oscillator type
   * (NesSequencer.OSCILLATOR_TYPES.PWM1), and the associated values is an array of objects, each looking like this:
   * { frequency: 440, volume: 0.2, duration: 1000 }, where frequency is in Hz, volume ranges between 0 and 1, and
   * duration is in millis.
   */
  play: function (melodies) {
    this.stop()

    initializePitches(melodies)

    // calculate the cycle length and start cycle for each melody note
    Object.keys(melodies).forEach(function (key) {
      var withCycle = convertDurationsToCycles(melodies[key])
      melodies[key] = calculateStartCyclesForMelody(withCycle)
    })

    var currentCycle = 0
    sequencerInterval = setInterval(function () {
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
    }, CYCLE_LENGTH_IN_MS)
  },

  stop: function () {
    clearInterval(sequencerInterval)

    // mute everything
    var oscillatorTypes = ['PWM1', 'PWM2', 'TRIANGLE', 'NOISE']
    oscillatorTypes.forEach(function (oscillator) {
      Oscillators.setPitch(oscillator, 440, 0)
    })
  }
}

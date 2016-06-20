var MMLIterator = require('mml-iterator')
var Effects = require('./effects')

var noteNumberToFrequency = function (noteNumber) {
  // a440 is 69
  var halftoneOffset = noteNumber - 69
  return 440 * Math.pow(2, halftoneOffset / 12)
}

module.exports = {
  mmlToMelody: function (mmlString) {
    var iterator = new MMLIterator(mmlString)

    // each entry is a "chord grouping", potentially with one note per grouping
    var chordGroupings = [[]]
    var current = iterator.next()
    var lastTime = current.value.time
    while (current.value.type !== 'end') {
      // if our current note doesn't occur at the same time as the last one, create a new chord grouping
      if (current.value.time !== lastTime) {
        chordGroupings.push([])
      }

      // push the current note onto the end of the current chord grouping
      chordGroupings[melody.length - 1].push({
        frequency: noteNumberToFrequency(current.value.noteNumber),
        volume: current.value.velocity / 127,
        cycles: Math.round(current.value.duration * 60)
      })

      lastTime = current.value.time

      current = iterator.next()
    }

    var melody = []
    chordGroupings.forEach(function (chord) {
      if (chord.length === 1) {
        return melody.push(chord[0])
      }

      var frequencies = chord.map(function (note) {
        return note.frequency
      })
      melody = melody.concat(Effects.Arpeggio(frequencies, chord[0].cycles, chord[0].volume))
    })

    return melody
  }
}

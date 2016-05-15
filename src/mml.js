var MMLIterator = require('mml-iterator')

var noteNumberToFrequency = function (noteNumber) {
  // a440 is 69
  var halftoneOffset = noteNumber - 69
  return 440 * Math.pow(2, halftoneOffset / 12)
}

module.exports = {
  mmlToMelody: function (mmlString) {
    var iterator = new MMLIterator(mmlString)

    var melody = []

    var current = iterator.next()
    while (current.value.type !== 'end') {
      melody.push({
        frequency: noteNumberToFrequency(current.value.noteNumber),
        volume: current.value.velocity / 127,
        cycles: Math.round(current.value.duration * 60)
      })

      current = iterator.next()
    }

    return melody
  }
}

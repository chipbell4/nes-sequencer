var MMLIterator = require('mml-iterator')
var Effects = require('./effects')

var noteNumberToFrequency = function (noteNumber) {
  // a440 is 69
  var halftoneOffset = noteNumber - 69
  return 440 * Math.pow(2, halftoneOffset / 12)
}

var cycles = function(duration) {
  var alpha = 100000000;
  return Math.round(Math.round(duration * 60 * alpha) / alpha);
}

module.exports = {
  mmlToMelody: function (mmlString) {
    var iterator = new MMLIterator(mmlString)

    // each entry is a "chord grouping", potentially with one note per grouping
    var chordGroupings = [[]]
    var current = iterator.next()
    var lastTime = current.value.time

    // handle the starting rest as well
    if(lastTime > 0) {
      chordGroupings[chordGroupings.length - 1].push({
        frequency: 440,
        volume: 0,
        cycles: cycles(lastTime),
      });
      chordGroupings.push([]);
    }

    var lastNoteEnd = current.value.duration + lastTime;
    while (current.value.type !== 'end') {
      // check if we need to add a rest. We'll need to add a rest if the current note ends before the next one starts
      if(current.value.time > lastNoteEnd) {
        var restLength = current.value.time - lastNoteEnd;
        chordGroupings.push([{
          frequency: noteNumberToFrequency(current.value.noteNumber),
          volume: 0,
          cycles: cycles(restLength),
        }]);
        chordGroupings.push([]);
      }
      // if our current note doesn't occur at the same time as the last one, create a new chord grouping
      else if (current.value.time !== lastTime) {
        chordGroupings.push([])
      }

      // push the current note onto the end of the current chord grouping
      chordGroupings[chordGroupings.length - 1].push({
        frequency: noteNumberToFrequency(current.value.noteNumber),
        volume: current.value.velocity / 127,
        cycles: cycles(current.value.duration),
      })

      lastTime = current.value.time
      lastNoteEnd = current.value.duration + current.value.time;

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

    melody.push({ frequency: 440, volume: 0, cycles: 1 });

    return melody
  }
}

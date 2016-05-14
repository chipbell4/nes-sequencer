module.exports = {
  Staccato: function (melody, noteReduction) {
    noteReduction = noteReduction || 0.5
    var newMelody = []
    for (var i = 0; i < melody.length; i++) {
      newMelody.push({
        frequency: melody[i].frequency,
        duration: melody[i].duration * noteReduction,
        volume: melody[i].volume
      })

      newMelody.push({
        frequency: melody[i + 1] ? melody[i + 1].frequency : melody[i].frequency,
        duration: melody[i].duration * (1 - noteReduction),
        volume: 0
      })
    }

    return newMelody
  },

  Arpeggio: function (frequencies, duration, startVolume, endVolume) {
    endVolume = endVolume === undefined ? startVolume : endVolume
    var noteDuration = 1 / 60 * 1000 // 60Hz refresh rate on NES
    var totalNotes = duration / noteDuration

    var melody = []
    for (var i = 0; i < totalNotes; i++) {
      var volume = startVolume + (endVolume - startVolume) * i / totalNotes
      var frequencyIndex = i % frequencies.length

      melody.push({
        frequency: frequencies[frequencyIndex],
        volume: volume,
        duration: noteDuration
      })
    }

    melody = this.ClampDuration(melody, duration)

    return melody
  },

  Vibrato: function (melody, vibratoFrequency, vibratoPercentage) {
    var vibratoMelodyComponents = melody.map(function (note) {
      var expanded = []

      for (var t = 0; t < note.duration; t += 50) {
        var offsetRatio = 1 + vibratoPercentage * Math.sin(t / 1000 * 2 * Math.PI * vibratoFrequency)
        expanded.push({
          volume: note.volume,
          duration: 50,
          frequency: note.frequency * offsetRatio
        })
      }

      melody = this.ClampDuration(expanded, note.duration)

      // correct any notes being too long
      var totalLength = expanded.reduce(function (sum, vibratoNote) {
        return sum + vibratoNote.duration
      }, 0)

      var lastNoteReduction = totalLength - note.duration
      expanded[expanded.length - 1].duration -= lastNoteReduction

      return expanded
    }.bind(this))

    // flatten
    return Array.prototype.concat.apply([], vibratoMelodyComponents)
  },

  ClampDuration: function (melody, duration) {
    // correct any notes being too long
    var totalLength = melody.reduce(function (sum, note) {
      return sum + note.duration
    }, 0)

    var lastNoteReduction = totalLength - duration
    melody[melody.length - 1].duration -= lastNoteReduction

    return melody
  }
}

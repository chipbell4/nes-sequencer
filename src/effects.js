module.exports = {
  Staccato: function (melody, noteReduction) {
    noteReduction = noteReduction || 0.5
    var newMelody = []
    for (var i = 0; i < melody.length; i++) {
      var shortCycles = Math.round(melody[i].cycles * noteReduction)
      newMelody.push({
        frequency: melody[i].frequency,
        cycles: shortCycles,
        volume: melody[i].volume
      })

      newMelody.push({
        frequency: melody[i + 1] ? melody[i + 1].frequency : melody[i].frequency,
        cycles: melody[i].cycles - shortCycles,
        volume: 0
      })
    }

    return newMelody
  },

  Arpeggio: function (frequencies, cycles, startVolume, endVolume) {
    endVolume = endVolume === undefined ? startVolume : endVolume

    var melody = []
    for (var i = 0; i < cycles; i++) {
      var volume = startVolume + (endVolume - startVolume) * i / cycles
      var frequencyIndex = i % frequencies.length

      melody.push({
        frequency: frequencies[frequencyIndex],
        volume: volume,
        cycles: 1
      })
    }

    return melody
  },

  Vibrato: function (melody, vibratoFrequency, vibratoPercentage) {
    var vibratoMelodyComponents = melody.map(function (note) {
      var melody = []

      for (var cycle = 0; cycle < note.cycles; cycle++) {
        var t = cycle / 60
        var offsetRatio = 1 + vibratoPercentage * Math.sin(t * 2 * Math.PI * vibratoFrequency)
        melody.push({
          volume: note.volume,
          cycles: 1,
          frequency: note.frequency * offsetRatio
        })
      }

      return melody
    })

    // flatten
    return Array.prototype.concat.apply([], vibratoMelodyComponents)
  }
}

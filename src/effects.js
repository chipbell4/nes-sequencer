/**
 * Effects module
 * @module NES.Effects
 * @see NES
 */
module.exports = {
  /**
   * Takes a sequence of melody notes and converts them to a shorter, staccato representation
   * @param {Array} melody The melody to shorten
   * @param {Number} noteReduction The percentage (0 - 1) to reduce the note length by
   * @return Array An updated melody, with shortened notes
   */
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

  /**
   * Takes a chord of frequencies and converts them into an arpeggiated chords that arpegiates at 60Hz (60 notes per
   * second, the NES limit)
   * @param {Array} frequencies An array of floating-point frequencies
   * @param {Number} cycles The number of cycles to run
   * @param {Number} startVolume The starting volume (0 - 1)
   * @param {Number} endVolume The ending volume (0 - 1), defaults to the starting volume
   * @return {Array} An array of notes that arpeggiates given the passed parameters
   */
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

  /**
   * Adds vibrato to a given melody. Typical might look like this: NES.Effects.Vibrato(myMelody, 5, 0.015)
   * @param {Array} melody The melody to add vibrato to
   * @param {Number} vibratoFrequency The frequency at which to oscillate the note
   * @param {Number} vibratoPercentage The percentage to vibrate by.
   * @return {Array} An updated, vibrato melody
   */
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

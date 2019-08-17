/**
 * A few helpful functions for music-based calculations
 * @module NES.MusicTools
 * @see NES
 */
module.exports = {
  /**
   * A set of tempos with subdivisions (down a 32nd note) that line up evenly on the NES's cycle speed
   */
  tempos: {
    Grave: 37,
    Largo: 50,
    Adagio: 75,
    Andante: 90,
    Moderato: 112.5,
    Allegro: 150,
    Presto: 225
  },

  /**
   * Calculates the frequency for a given note in scientific pitch notation
   * @param {String} note A string to convert (like "A5", "Db3" or "G#4")
   * @return {Number} The frequency of the note
   */
  frequency: function (note) {
    var octave = Number(note[note.length - 1])
    var pitch = note.substr(0, note.length - 1)
    var pitchNames = [
      ['C', 'B#'],
      ['C#', 'Db'],
      'D',
      ['D#', 'Eb'],
      ['E', 'Fb'],
      'F',
      ['F#', 'Gb'],
      'G',
      ['G#', 'Ab'],
      'A',
      ['A#', 'Bb'],
      'B'
    ]

    // find the pitch offset
    var pitchOffset = 0
    for (pitchOffset = 0; pitchOffset < 12; pitchOffset++) {
      if (pitchNames[pitchOffset] instanceof Array && pitchNames[pitchOffset].indexOf(pitch) !== -1) {
        break
      } else if (pitchNames[pitchOffset] === pitch) {
        break
      }
    }

    var oneSemitone = Math.pow(2, 1 / 12)
    var semitones = (octave - 4) * 12 + pitchOffset
    var c4 = 261.63
    return c4 * Math.pow(oneSemitone, semitones)
  }
}

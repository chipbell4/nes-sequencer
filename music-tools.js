var MusicTools = {
  duration: function(tempo, noteType) {
    return (60 / tempo * noteType) * 1000;
  },

  frequency: function(note) {
    var octave = Number(note[note.length - 1]);
    var pitch = note.substr(0, note.length - 1);
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
    ];

    // find the pitch offset
    var pitchOffset = 0;
    for(pitchOffset = 0; pitchOffset < 12; pitchOffset++) {
      if(pitchNames[pitchOffset] instanceof Array && pitchNames[pitchOffset].indexOf(pitch) != -1) {
        break;
      } else if(pitchNames[pitchOffset] == pitch) {
        break;
      }
    }

    var oneSemitone = Math.pow(2, 1/12);
    var semitones = (octave - 4) * 12 + pitchOffset;
    var c4 = 261.63;
    return c4 * Math.pow(oneSemitone, semitones);
  },
};

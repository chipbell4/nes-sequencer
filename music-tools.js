var MusicTools = {
  noteDurationInMillis: function(tempo, noteType) {
    return (60 / tempo * noteType) * 1000;
  },

  frequency: function(note) {
    var octave = Number(note[note.length - 1]);
    var pitch = note.substr(0, note.length - 1);
    var pitchNames = [
      'A',
      ['A#', 'Bb'],
      'B',
      ['C', 'B#'],
      ['C#', 'Db'],
      'D',
      ['D#', 'Eb'],
      ['E', 'Fb'],
      'F',
      ['F#', 'Gb'],
      'G',
      ['G#', 'Ab']
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
    var semitones = (octave - 5) * 12 + pitchOffset;
    return 440 * Math.pow(oneSemitone, semitones);
  },
};

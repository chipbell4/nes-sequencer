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

  parse: function(note) {
    var durationMap = {
      W: 4,
      H: 2,
      Q: 1,
      E: 0.5,
      T: 0.33,
      S: 0.25
    }
    var volumeMap = {
      pp: 0.1,
      p: 0.2,
      mp: 0.3,
      mf: 0.4,
      f: 0.5,
      ff: 0.6
    };

    var split = note.split(' ');
    var frequency = this.frequency(split[0]);
    var duration = this.duration(TEMPO || 120, durationMap[split[1]] || 1);
    var volume = volumeMap[2] || 0.5;

    return { frequency: frequency, duration: duration, volume: volume };
  }
};

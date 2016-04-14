var Arp = (function() {
  var tempo = 110;

  var melody = {
    PWM1: [],
    PWM2: [],
    TRIANGLE: [],
    NOISE: [],
  };

  // lead riff
  var lead = ['Eb5', 'Db5', 'B4', 'Eb5', 'Eb5', 'Gb5', 'Ab5', 'Eb5'];
  var rhythms = [2.5, 0.75, 0.75, 4, 2.5, 0.75, 0.75, 4];
  for(var i = 0; i < 8; i++) {
    var frequency = NES.MusicTools.frequency(lead[i]);
    var duration = NES.MusicTools.duration(tempo, rhythms[i]);
    var notes = [{
      frequency: frequency,
      duration: duration,
      volume: 0.3
    }];

    if(lead[i] == 'Eb5') {
      notes = NES.Effects.Vibrato(notes, 5, 0.015);
    }

    melody.PWM1 = melody.PWM1.concat(notes);
  }
  melody.PWM1 = melody.PWM1.concat(melody.PWM1);
  melody.PWM1.unshift({
    frequency: 440,
    duration: NES.MusicTools.duration(tempo, 16),
    volume: 0
  });

  // chords
  var chords = [
    ['Ab3', 'B3', 'Eb4'],
    ['Ab3', 'B3', 'E4'],
    ['Bb3', 'Db3', 'Gb4'],
    ['Bb3', 'Db3', 'E4', 'G4'],
  ];
  chords.forEach(function(chord) {
    var frequencies = chord.map(NES.MusicTools.frequency);
    var duration = NES.MusicTools.duration(tempo, 4);

    melody.PWM2 = melody.PWM2.concat(NES.Effects.Arpeggio(frequencies, duration, 0.1, 0.0));
  });

  melody.PWM2 = melody.PWM2.concat(melody.PWM2);
  melody.PWM2 = melody.PWM2.concat(melody.PWM2);

  // Bass line
  ['Ab2', 'E2', 'Gb2', 'Eb2'].map(NES.MusicTools.frequency).forEach(function(frequency) {
    var eighth = NES.MusicTools.duration(tempo, 0.5);
    var quarter = NES.MusicTools.duration(tempo, 1.0);
    var halfPlusEighth = NES.MusicTools.duration(tempo, 2.5);
    melody.TRIANGLE.push({ frequency: frequency, duration: eighth, volume: 1.0 });
    melody.TRIANGLE.push({ frequency: frequency, duration: quarter, volume: 0.0 });
    melody.TRIANGLE.push({ frequency: frequency, duration: halfPlusEighth, volume: 1.0 });
  });

  melody.TRIANGLE = melody.TRIANGLE.concat(melody.TRIANGLE);
  melody.TRIANGLE = melody.TRIANGLE.concat(melody.TRIANGLE);

  // Drums
  var pitches = [100, 3000, 500, 100, 3000, 3000, 3000, 500];
  melody.NOISE = pitches.map(function(frequency) {
    return {
      frequency: frequency,
      volume: 0.5,
      duration: NES.MusicTools.duration(tempo, 0.5),
    };
  });
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = NES.Effects.Staccato(melody.NOISE, 0.25);

  return { melody: melody };
})();

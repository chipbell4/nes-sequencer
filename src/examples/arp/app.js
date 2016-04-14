var Arp = (function() {
  var tempo = 110;

  var melody = {
    PWM2: [],
    TRIANGLE: [],
    NOISE: [],
  };

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

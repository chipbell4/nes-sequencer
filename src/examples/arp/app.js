var Arp = (function() {
  var tempo = 110;
  var CYCLES_FOR_SIXTEENTH = Math.round(0.25 * 3600 / tempo);
  var CYCLES_FOR_QUARTER = CYCLES_FOR_SIXTEENTH * 4; // so we have a multiple of 4

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
    var notes = [{
      frequency: NES.MusicTools.frequency(lead[i]),
      cycles: Math.round(CYCLES_FOR_QUARTER * rhythms[i]),
      volume: 1.0
    }];

    notes = NES.Effects.Vibrato(notes, 5, 0.015);

    melody.PWM1 = melody.PWM1.concat(notes);
  }
  melody.PWM1 = melody.PWM1.concat(melody.PWM1);
  melody.PWM1.unshift({
    frequency: 440,
    cycles: CYCLES_FOR_QUARTER * 16,
    volume: 0
  });
  melody.PWM1.push({
    frequency: 440,
    cycles: 1,
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
    var cycles = CYCLES_FOR_QUARTER * 4;

    melody.PWM2 = melody.PWM2.concat(NES.Effects.Arpeggio(frequencies, cycles, 0.5, 0.0));
  });

  melody.PWM2 = melody.PWM2.concat(melody.PWM2);
  melody.PWM2 = melody.PWM2.concat(melody.PWM2);

  // Bass line
  ['Ab2', 'E2', 'Gb2', 'Eb2'].map(NES.MusicTools.frequency).forEach(function(frequency) {
    var eighth = Math.round(0.5 * CYCLES_FOR_QUARTER);
    var quarter = CYCLES_FOR_QUARTER;
    var halfPlusEighth = Math.round(2.5 * CYCLES_FOR_QUARTER);
    melody.TRIANGLE.push({ frequency: frequency, cycles: eighth, volume: 1.0 });
    melody.TRIANGLE.push({ frequency: frequency, cycles: quarter, volume: 0.0 });
    melody.TRIANGLE.push({ frequency: frequency, cycles: halfPlusEighth, volume: 1.0 });
  });

  melody.TRIANGLE = melody.TRIANGLE.concat(melody.TRIANGLE);
  melody.TRIANGLE = melody.TRIANGLE.concat(melody.TRIANGLE);
  melody.TRIANGLE.push({ frequency: 440, cycles: 1, volume: 0 });

  // Drums
  var pitches = [100, 3000, 500, 100, 3000, 3000, 3000, 500];
  melody.NOISE = pitches.map(function(frequency) {
    return {
      frequency: frequency,
      volume: 0.5,
      cycles: 2 * CYCLES_FOR_SIXTEENTH
    };
  });
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = melody.NOISE.concat(melody.NOISE);
  melody.NOISE = NES.Effects.Staccato(melody.NOISE, 0.25);

  return { melody: melody };
})();

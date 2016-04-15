KK.melody.PWM2 = (function() {
  var rest = function(durationName) {
    return { frequency: 0, volume: 0, duration: KK[durationName] };
  };

  var chords = {
    E: ['E5', 'G#5', 'B5'].map(NES.MusicTools.frequency),
    A: ['E5', 'A5', 'C#6'].map(NES.MusicTools.frequency),
    D: ['F#5', 'A5', 'D6'].map(NES.MusicTools.frequency),
    B: ['F#5', 'B5', 'D#6'].map(NES.MusicTools.frequency)
  };

  var melody = [];

  // Emaj lick
  melody = melody.concat(NES.Effects.Arpeggio(chords.E, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.E, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.E, KK.Q, 0.2));
  melody.push(rest('D'));

  // Amaj
  melody = melody.concat(NES.Effects.Arpeggio(chords.A, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.A, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.A, KK.S, 0.2));
  melody.push(rest('S'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.A, KK.Q, 0.2));
  melody.push(rest('Q'));

  // Dmaj
  melody = melody.concat(NES.Effects.Arpeggio(chords.D, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.D, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.D, KK.Q, 0.2));
  melody.push(rest('D'));
  
  // Bmaj
  melody = melody.concat(NES.Effects.Arpeggio(chords.B, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.B, KK.T, 0.2));
  melody.push(rest('D'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.B, KK.S, 0.2));
  melody.push(rest('S'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.B, KK.Q, 0.2));
  melody.push(rest('Q'));

  // push the pick-up note rest
  melody.unshift(rest('Q'));

  return melody;
})();

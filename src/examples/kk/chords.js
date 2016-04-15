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
  melody.push(rest('H'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.E, KK.H, 0.2, 0));

  // Amaj
  melody.push(rest('H'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.A, KK.H, 0.2, 0));

  // Dmaj
  melody.push(rest('H'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.D, KK.H, 0.2, 0));
  
  // Bmaj
  melody.push(rest('H'));
  melody = melody.concat(NES.Effects.Arpeggio(chords.B, KK.H, 0.2, 0));

  // double up
  melody = melody.concat(melody);

  // push the pick-up note rest
  melody.unshift(rest('Q'));

  return melody;
})();

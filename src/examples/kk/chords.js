KK.melody.PWM2 = (function() {
  var rest = function(cyclesName) {
    return { frequency: 0, volume: 0, cycles: KK[cyclesName] };
  };

  var chords = {
    E: ['E4', 'G#4', 'B4'].map(NES.MusicTools.frequency),
    A: ['E4', 'A4', 'C#5'].map(NES.MusicTools.frequency),
    D: ['F#4', 'A4', 'D5'].map(NES.MusicTools.frequency),
    B: ['F#4', 'B4', 'D#5'].map(NES.MusicTools.frequency)
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

  //return melody;
  return [ rest('Q'), rest('Q') ];
})();

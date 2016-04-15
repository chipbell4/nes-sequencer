KK.melody.PWM1 = (function() {
  var rest = function(durationName) {
    return { frequency: 0, volume: 0, duration: KK[durationName] };
  };

  var melody = [];

  var rhythm1 = ['D', 'T', 'T', 'D', 'T', 'D', 'Q', 'D', 'T', 'Q', 'Q', 'Q'];
  var melodyLine1 = ['E5', 'D#5', 'E5', '', 'B4', '', 'G#4', 'A4', 'B4', '', '', ''];
  var melodyLine2 = ['D5', 'C#5', 'D5', '', 'E5', '', 'C#5', 'A4', 'B4', '', '', ''];

  var glueRhythmMelody = function(R, M) {
    for(var i = 0; i < R.length; i++) {
      var volume = M[i] == '' ? 0.0 : 0.5;
      var frequency = M[i] == '' ? 440 : NES.MusicTools.frequency(M[i]);
      melody.push({
        frequency: frequency,
        volume: volume,
        duration: KK[rhythm1[i]]
      });
    }
  }

  glueRhythmMelody(rhythm1, melodyLine1);
  glueRhythmMelody(rhythm1, melodyLine2);

  console.log(melody);

  return melody;
})();

KK.melody.TRIANGLE = (function() {
  var rest = function(cyclesName) {
    return { frequency: 0, volume: 0, cycles: KK[cyclesName] };
  };

  var melody = [];
  
  var glueRhythmMelody = function(R, M) {
    for(var i = 0; i < R.length; i++) {
      var volume = M[i] == '' ? 0.0 : 0.1;
      var frequency = M[i] == '' ? 440 : NES.MusicTools.frequency(M[i]);
      melody.push({
        frequency: frequency,
        volume: volume,
        cycles: KK[R[i]]
      });
    }
  }


  // wait 7 bars for the intro
  melody.push({ frequency: 0, volume: 0, cycles: 7 * 4 * KK.Q });

  // bass pickup
  var pickupRhythm = [ 'T', 'D',  'T',  'D',  'D',   'T',   'T', 'D'];
  var pickupMelody = ['B2',  '', 'B2',   '', 'G2', 'G#2', 'F#2', ''];
  glueRhythmMelody(pickupRhythm, pickupMelody);

  // main bass line
  var eRhythm =  [ 'T', 'D', 'D',  'T',   'T', 'D',  'T', 'D'];
  var ePitches = ['E2',  '',  '', 'E2', 'G#2',  '', 'B2', ''];
  glueRhythmMelody(eRhythm, ePitches);

  var aRhythm =  ['D',  'T',   'T', 'D',  'D',   'T',  'T', 'D'];
  var aPitches = [ '', 'A2', 'C#3',  '', 'G2', 'G#2', 'A2', ''];
  glueRhythmMelody(aRhythm, aPitches);

  var dRhythm = [  'T', 'D',  'T', 'D',  'D',  'T', 'T', 'D'];
  var dPitches = ['D2',  '', 'D2',  '', 'D3', 'A2', 'D2', ''];
  glueRhythmMelody(dRhythm, dPitches);

  var bRhythm =  [ 'T', 'D',  'T', 'D',   'T', 'D',  'T', 'D'];
  var bPitches = ['B2',  '', 'A2',  '', 'G#2',  '', 'F#2', ''];
  glueRhythmMelody(bRhythm, bPitches);

  // pickup notes for melody intro
  melody.unshift(rest('Q'));

  return [rest('Q'), rest('Q')];
})();

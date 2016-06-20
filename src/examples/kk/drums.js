KK.melody.NOISE = (function() {
  var rest = function(cyclesName) {
    return { frequency: 0, volume: 0, cycles: KK[cyclesName] };
  };

  var drumTypes = {
    B: 100,
    S: 1000,
  };

  var rhythmMML = [
    't' + KK.tempo,
    'v100',
    '<< c6 c12 /: c >>> c <<< c6 c12 >>> c <<< :/35'
  ].join(' ');
  var melody = NES.Mml.mmlToMelody(rhythmMML);
  return NES.Effects.Staccato(melody, 0.25);
})();

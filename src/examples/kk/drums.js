KK.melody.NOISE = (function() {
  var rest = function(durationName) {
    return { frequency: 0, volume: 0, duration: KK[durationName] };
  };

  var drumTypes = {
    B: 100,
    S: 1000,
  };
  var rhythm = ['Q', 'Q', 'D', 'T', 'D', 'T', 'D', 'T', 'Q', 'D', 'T', 'Q'];
  var type =   ['B', 'S', 'B', 'B', 'S', 'B', '', 'B', 'S', 'B', 'B', 'S'];

  var melody = [];
  for(var i = 0; i < rhythm.length; i++) {
    melody.push({
      frequency: drumTypes[type[i]] || drumTypes.B,
      volume: type[i] !== '' ? 0.2 : 0.0,
      duration: KK[rhythm[i]]
    });
  }

  melody = melody.concat(melody);
  melody = melody.concat(melody);
  melody = melody.concat(melody);
  melody = melody.concat(melody);
  melody = melody.concat(melody);

  // pick up note
  melody.unshift(rest('Q'));

  return NES.Effects.Staccato(melody, 0.25);
})();

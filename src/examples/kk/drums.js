KK.melody.NOISE = (function() {
  var rest = function(durationName) {
    return { frequency: 0, volume: 0, duration: KK[durationName] };
  };

  var rhythm =     ['Q',  'D',  'T',   'Q', 'D', 'T'];
  var frequencies = [100, 5000, 5000, 1000, 5000, 5000];
  var melody = [];
  
  for(var i = 0; i < rhythm.length; i++) {
    melody.push({
      frequency: frequencies[i],
      volume: 0.2,
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

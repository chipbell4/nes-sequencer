var MELODY1 = (function() {

  var raw = [];
  var N = RHYTHM.length;
  for(var i = 0; i < N; i++) {
    raw.push({
      frequency: 440,
      duration: RHYTHM[i],
      volume: RESTS[i],
    });
  }

  return Staccato(raw.concat(raw));
})();

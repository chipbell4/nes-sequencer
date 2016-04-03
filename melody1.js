var MELODY1 = (function() {
  var raw = RHYTHM.map(function(note) {
    return {
      duration: note.duration,
      volume: note.volume,
      frequency: 440
    };
  });

  return Staccato(raw);
})();

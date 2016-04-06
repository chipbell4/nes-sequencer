var MELODY1 = (function() {
  var scaleTones = ['C#5', 'D#5', 'E5', 'F#5', 'G#5', 'A#6', 'B6', 'C#6', 'D#6', 'E6'].map(MusicTools.frequency);

  var phrase1 = [
    2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 4, 3, 2
  ];
  var phrase2 = [
    2, 2, 2, 2, 2, 2, 0, 4, 3, 2, 2, 2,
  ];
  var phrase3 = [
    3, 3, 3, 3, 3, 3, 1, 4, 3, 2, 1, 0,
  ];
  var phrase4 = [
    0, 4, 6, 5, 0, 4, 6, 5, 8, 9
  ];

  var fullMelody = phrase1.concat(phrase2).concat(phrase3).concat(phrase4);
  var melodyIndex = 0;

  var raw = RHYTHM.map(function(note) {
    var frequency = 0;
    if(note.volume > 0) {
      frequency = scaleTones[fullMelody[melodyIndex]];
      melodyIndex++;
    }

    return {
      duration: note.duration,
      volume: note.volume,
      frequency: frequency
    };
  });

  
  // only make phrase1, 2, 3 staccato
  var phrase123Length = raw.length - phrase4.length;
  var phrase123Staccato = Staccato(raw.slice(0, phrase123Length));
  var phrase4Staccato = Staccato(raw.slice(phrase123Length), 0.99);
  var full = phrase123Staccato.concat(phrase4Staccato);

  return full.concat(full);
})();

var MELODY2 = (function() {
  var scaleTones = ['C#4', 'G#4', 'A5', 'A#5', 'B5','C#5', 'D#5', 'E5', 'B6', 'C#6'].map(MusicTools.frequency);

  console.log(scaleTones);

  var phrase1 = [
    5, 5, 5, 5, 5, 5, 2, 5, 5, 5, 5, 2, 5, 5, 4, 1
  ];
  var phrase2 = [
    5, 5, 5, 5, 5, 5, 2, 5, 4, 1, 1, 1,
  ];
  var phrase3 = [
    6, 6, 6, 6, 6, 6, 4, 7, 6, 5, 4, 2,
  ];
  var phrase4 = [
    0, 1, 4, 3, 0, 1, 4, 3, 7, 8
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

  return Staccato(raw.concat(raw));
})();

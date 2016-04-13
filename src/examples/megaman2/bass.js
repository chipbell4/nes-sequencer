Megaman2.melody[NesSequencer.OSCILLATOR_TYPES.TRI] = (function() {
  var cSharpBass = MusicTools.frequency('C#3');
  var bBass = MusicTools.frequency('B2');
  var aBass = MusicTools.frequency('A2');
  var eighth = MusicTools.duration(TEMPO, 0.5);
  var sixteenth = MusicTools.duration(TEMPO, 0.25);

  var riffOne = [
    { frequency: cSharpBass, volume: 0.2, duration: eighth },
    { frequency: cSharpBass, volume: 0.2, duration: sixteenth },
    { frequency: cSharpBass, volume: 0.2, duration: sixteenth },
  ];
  // make staccato, then into an eight beat lick
  riffOne = Staccato(riffOne);
  riffOne = riffOne.concat(riffOne);
  riffOne = riffOne.concat(riffOne);
  riffOne = riffOne.concat(riffOne); // eight beats of the riff

  var riffTwo = riffOne.map(function(note) {
    return { frequency: aBass, duration: note.duration, volume: note.volume };
  });

  var riffThree = riffOne.map(function(note) {
    return { frequency: bBass, duration: note.duration, volume: note.volume };
  });

  var fullBassRiff = riffOne.concat(riffTwo).concat(riffThree).concat(riffOne);
  fullBassRiff = fullBassRiff.concat(fullBassRiff);

  return fullBassRiff;
})();

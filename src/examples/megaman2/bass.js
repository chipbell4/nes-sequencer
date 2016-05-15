Megaman2.melody.TRIANGLE = (function() {
  var cSharpBass = NES.MusicTools.frequency('C#3');
  var bBass = NES.MusicTools.frequency('B2');
  var aBass = NES.MusicTools.frequency('A2');
  
  var riffOne = [
    { frequency: cSharpBass, volume: 0.2, cycles: Megaman2.E },
    { frequency: cSharpBass, volume: 0.2, cycles: Megaman2.S },
    { frequency: cSharpBass, volume: 0.2, cycles: Megaman2.S },
  ];
  // make staccato, then into an eight beat lick
  riffOne = NES.Effects.Staccato(riffOne);
  riffOne = riffOne.concat(riffOne);
  riffOne = riffOne.concat(riffOne);
  riffOne = riffOne.concat(riffOne); // eight beats of the riff

  var riffTwo = riffOne.map(function(note) {
    return { frequency: aBass, cycles: note.cycles, volume: note.volume };
  });

  var riffThree = riffOne.map(function(note) {
    return { frequency: bBass, cycles: note.cycles, volume: note.volume };
  });

  var fullBassRiff = riffOne.concat(riffTwo).concat(riffThree).concat(riffOne);
  fullBassRiff = fullBassRiff.concat(fullBassRiff);

  return fullBassRiff;
})();

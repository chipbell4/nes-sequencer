Megaman2.melody[NesSequencer.OSCILLATOR_TYPES.NOISE] = (function() {
  var eighth = MusicTools.duration(TEMPO, 0.5);
  var sixteenth = MusicTools.duration(TEMPO, 0.25);

  var drumRiff = [
    { frequency: 8000, volume: 0.2, duration: eighth },
    { frequency: 8000, volume: 0.2, duration: sixteenth },
    { frequency: 8000, volume: 0.2, duration: sixteenth },
    { frequency: 3000, volume: 0.2, duration: eighth },
    { frequency: 8000, volume: 0.2, duration: sixteenth },
    { frequency: 8000, volume: 0.2, duration: sixteenth },
  ];
  var fullDrumRiff = Staccato(drumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);

  return fullDrumRiff;
})();

Megaman2.melody.NOISE = (function() {
  var drumRiff = [
    { frequency: 8000, volume: 0.2, cycles: Megaman2.E },
    { frequency: 8000, volume: 0.2, cycles: Megaman2.S },
    { frequency: 8000, volume: 0.2, cycles: Megaman2.S },
    { frequency: 3000, volume: 0.2, cycles: Megaman2.E },
    { frequency: 8000, volume: 0.2, cycles: Megaman2.S },
    { frequency: 8000, volume: 0.2, cycles: Megaman2.S },
  ];
  var fullDrumRiff = NES.Effects.Staccato(drumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
  fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);

  return fullDrumRiff;
})();

var Megaman2 = (function() {
  var tempo = 180;
  var sixteenth = Math.round(1 / 4 * 3600 / tempo);

  return {
    melody: {},
    tempo: tempo,
    S: sixteenth,
    E: sixteenth * 2,
    Q: sixteenth * 4
  };
})();

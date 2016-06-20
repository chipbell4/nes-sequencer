var KK = (function() {
  var tempo = 194;
  var SIXTH = Math.round(1/ 6 * 3600 / tempo);

  return {
    tempo: 200,
    // Some constants for common durations
    S: SIXTH,
    T: SIXTH * 2,
    D: SIXTH * 4,
    Q: SIXTH * 6,
    H: SIXTH * 12,
    melody: { }
  };
})();

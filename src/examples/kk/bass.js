KK.melody.TRIANGLE = (function() {
  var bassMml = [
    't' + KK.tempo,
    'v100',
    'l4 r', // pickup
    '<<',
    'l12',

    // Main theme
    'e r6 e r6 e4^6 a',
    'r6 a r6 a a4 r4',
    'd r6 d r6 d4^6 b',
    'r6 b r6 b b4 r4',
    'e r6 e r6 e4^6 a',
    'r6 a r6 a a4 r4',
    'd r6 d r6 d4^6 b',
    'r6 b r6 b b4 r4',
    'e r6 e r6 e4^6 a',
    'r6 a r6 a a4 r4',
    'd r6 d r6 d4^6 b',
    'r6 b r6 b b4 r4',
    'e r6 e r6 e4^6 a',
    'r6 a r6 a a4 r4',
    'b r6 b r6 b4^6 e',
    'r6 e r6 e e4 r4',
  ].join(' ');

  return NES.Mml.mmlToMelody(bassMml);
})();

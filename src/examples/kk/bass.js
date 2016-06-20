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
  
    // bridge
    'g+ r6^6 g+ g+4 r4 g+ r6^6 g+ g+4 r4',
    'c+ r6^6 c+ c+4 r4 c+ r6^6 c+ c+4 r4',
    'f+ r6^6 f+ f+4 r4 f+ r6^6 f+ f+4 r4',
    'l16 brrr brrr > crrr crrr < brrr l4 rrrr l12',
    
    // Reprise
    'e r6 e r6 e4^6 a',
    'r6 a r6 a a4 r4',
    'd r6 d r6 d4^6 b',
    'r6 b r6 b b4 r4',
    'e r6 e r6 e4^6 a',
    'r6 a r6 a a4 r4',
    'c r6 c r6 d4^6 e',
    'l4 rrrr l12',
    'c r6 c r6 d4^6 e',
    'l4 rrrr l12',
    'c r6 c r6 d4^6 e2',
  ].join(' ');

  return NES.Mml.mmlToMelody(bassMml);
})();

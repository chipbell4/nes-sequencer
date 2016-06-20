KK.melody.PWM1 = (function() {
  var mainThemeMML = [
    't' + KK.tempo,
    'v20',
    '> e6 d+12 e < b g+ a6 b12 r r r',
    '> d6 c+12 d e < > c+ < a6 b12 r r r',
    '> e6 d+12 e f+ g+ e6 a12 r r r',
    'a6 g+12 a g+ f+ e6 f+12 r r r',
    'e6 d+12 e < b g+ a6 b12 r r r',
    '> d6 c+12 d e < > c+ < a6 b12 r r r',
    '> e6 d+12 e f+ g+ e6 a a12 g+ f+ e d+ e f+ d+6 e12 r r r',
  ].join(' ');

  return NES.Mml.mmlToMelody(mainThemeMML);
})();

KK.melody.PWM2 = (function() {
  //  'l4 r', // pickup note
  //  'l1 rrrrrrrrrrrrrrrr',
  var bridgeChordsMML = [
    't' + KK.tempo,
    'v20',
    'l1',
    '[g+ c d+]^', 
    '[g+ b f]^',
    '[f+ a+ c+ e]^',
    'l16',
    '[b d+ f+] rrr',
    '[b d+ f+] rrr',
    '[e g > c] rrr',
    '[e g > c] rrr',
    '[b d+ f+] rrr',
  ].join(' ');

  var bridge = NES.Mml.mmlToMelody(bridgeChordsMML);
  return bridge;
})();

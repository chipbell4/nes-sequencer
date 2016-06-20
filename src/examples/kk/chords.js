KK.melody.PWM2 = (function() {
  var chordsMml = [
    't' + KK.tempo,
    'v20',
    'l4 r', // pickup

    // melody chords
    'l8',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'rr[ d a f+]r rr[d a f+]r',
    'rr[d+ f+ b]r rr[d+ f+ b]r',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'rr[ d a f+]r rr[d a f+]r',
    'rr[d+ f+ b]r rr[d+ f+ b]r',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'rr[ d a f+]r rr[d a f+]r',
    'rr[d+ f+ b]r rr[d+ f+ b]r',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'rr[d+ f+ b]r rr[d+ f+ b]r',
    'rr[ e g+ b]r rr[e g+ b]r',
    
    // bridge chords
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
    'l4 rrr',
    
    // more melody chords
    'l8',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'rr[ d a f+]r rr[d a f+]r',
    'rr[d+ f+ b]r rr[d+ f+ b]r',
  ].join(' ');

  return NES.Mml.mmlToMelody(chordsMml);
})();

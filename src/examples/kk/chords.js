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
    'l1 v10',
    '[g+ c d+]^', 
    '[g+ b f]^',
    '[f+ a+ c+ e]^',
    'l8',
    '[b d+ f+]r',
    '[b d+ f+]r',
    '[e g > c]r',
    '[e g > c]r',
    '[b d+ f+]r',
    'l4 rrr',
    
    // Reprise
    'l8 v20',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'rr[ d a f+]r rr[d a f+]r',
    'rr[d+ f+ b]r rr[d+ f+ b]r',
    'rr[ e g+ b]r rr[e g+ b]r',
    'rr[ e a c+]r rr[e a c+]r',
    'l12',
    '[ceg] r6 [ceg] r6 [df+a]4^6 [eg+b]',
    'l4 rrrr l12',
    '[ceg] r6 [ceg] r6 [df+a]4^6 [eg+b]',
    'l4 rrrr l12',
    '[ceg] r6 [ceg] r6 [df+a]4^6 [eg+b]2',
  ].join(' ');

  return NES.Mml.mmlToMelody(chordsMml);
})();

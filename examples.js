(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
require('./kk/app.js');
require('./roswell/app.js');
require('./smb2/app.js');

const channels = ['PWM1', 'PWM2', 'TRIANGLE', 'NOISE'];
const buttons = document.querySelectorAll('footer button[data-song-id]');
for (const button of buttons) {
    button.addEventListener('click', () => {
        const songId = button.dataset.songId;

        // load that song into the text areas
        for (const channel of channels) {
            document.querySelector(`textarea[data-channel=${channel}]`).value = window[songId][channel];
        }
    });
}

document.getElementById('play').addEventListener('click', () => {
    // play whatever's in the textarea
    const sequencerData = {};
    for (const channel of channels) {
        var textarea = document.querySelector(`textarea[data-channel=${channel}]`);
        try {
            sequencerData[channel] = NES.Mml.mmlToMelody(textarea.value);
        } catch(e) {
            sequencerData[channel] = [
              { frequency: 440, volume: 0 }
            ];
        }
    }

    // play it in the sequencer
    NES.Sequencer.stop();
    NES.Oscillators.context.resume().then(() => {
        NES.Sequencer.play(sequencerData, false);
    });
});

document.getElementById('stop').addEventListener('click', () => NES.Sequencer.stop());
document.getElementById('reset').addEventListener('click', () => {
    for (const channel of channels) {
        var textarea = document.querySelector(`textarea[data-channel=${channel}]`);
        textarea.value = '';
    }
});

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const points = {
  PWM1: [],
  PWM2: [],
  TRIANGLE: [],
  NOISE: [],
};
const MAX_POINTS = 10;
NES.Events.Bus.addEventListener(NES.Events.Types.OSCILLATOR_CHANGE, function(e) {
  points[e.oscillatorIndex].push(Object.assign({ when: Date.now()}, e));
  if (points[e.oscillatorIndex].length > MAX_POINTS) {
    points[e.oscillatorIndex].shift();
  }
});

const drawPoints = (p, color) => {
  const W = canvas.width;
  ctx.fillStyle = color;
  for (let i = 0; i < p.length; i++) {
    const x = W * i / MAX_POINTS;

    const halfStepsFromA = Math.log(p[i].frequency / 440) / Math.log(Math.pow(2, 1/12))
    const y = 70 - halfStepsFromA * 2
    const w = W / MAX_POINTS;
    const h = p[i].volume * 10;

    ctx.fillRect(x, y, W / MAX_POINTS, p[i].volume * 30)
  }
};

const draw = () => {
  requestAnimationFrame(draw);
  
  const W = canvas.width;
  ctx.clearRect(0, 0, W, W);

  // just draw PWM1 for now
  drawPoints(points.PWM1, '#F87068');
  drawPoints(points.PWM2, '#28C020');
  drawPoints(points.TRIANGLE, '#20A0F8');
}
requestAnimationFrame(draw);

},{"./kk/app.js":2,"./roswell/app.js":7,"./smb2/app.js":12}],2:[function(require,module,exports){
window.KK = {
  tempo: 200,
  TRIANGLE: require('./bass.js'),
  PWM1: require('./melody.js'),
  PWM2: require('./chords.js'),
  NOISE: require('./drums.js'),
};

},{"./bass.js":3,"./chords.js":4,"./drums.js":5,"./melody.js":6}],3:[function(require,module,exports){
module.exports = [
  't200',
  'v75',
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
  'l8 br br > cr cr < br l4 rrr l12',

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
  ].join('\n');

},{}],4:[function(require,module,exports){
module.exports = [
  't200',
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
  ].join('\n');

},{}],5:[function(require,module,exports){
module.exports = [
  't200',
  'v15',
  'l12',
  'b r b /: d r r b r d r r d b r r :/35'
].join('\n');

},{}],6:[function(require,module,exports){
module.exports = [
  't200',
  'v20',
  'l4',

  // The melody
  '> e6 d+12 e < b g+ a6 b12 r r r',
  '> d6 c+12 d e < > c+ < a6 b12 r r r',
  '> e6 d+12 e f+ g+ e6 a12 r r r',
  'a6 g+12 a g+ f+ e6 f+12 r r r',
  'e6 d+12 e < b g+ a6 b12 r r r',
  '> d6 c+12 d e < > c+ < a6 b12 r r r',
  '> e6 d+12 e f+ g+ e6 a a12 g+ f+ e d+ e f+ d+6 e12 r4 r4 r4 r4',

  // bridge
  'c4 c+6 d12 d+6 f12 d+6 <b12 >c6 d+12 c6 <g+6^6',
  'g+12 g12 f+12',
  'e6 f12 g+6 a+12 b6 a+12 g+6 e12 f6 g+12 f6 c+12',
  'r6 c+12 d+6 f12',
  'l12 f+4 c+d+ef+g+aa+b>cc+d+ef+g+aa+f+d+c+<a+f+',
  'l8 br br > cr cr < br l4 rr',

  // Reprise
  '> e6 d+12 e < b g+ a6 b12 r r r',
  '> d6 c+12 d e < > c+ < a6 b12 r r r',
  '> e6 d+12 e f+ g+ e6 a12 r r r r6 a12',
  'l12',
  'g r6 g r6 a4^6 b ',
  'l4 rrrr6 l12 a',
  'g r6 g r6 a4^6 b',
  'l4 rrrr6 l12 a',
  'g r6 g r6 a4^6 b2',

  ].join('\n');

},{}],7:[function(require,module,exports){
window.Roswell = {
  PWM1: require('./melody.js'),
  PWM2: require('./chords.js'),
  TRIANGLE: require('./bass.js'),
  NOISE: require('./drums.js'),
}

},{"./bass.js":8,"./chords.js":9,"./drums.js":10,"./melody.js":11}],8:[function(require,module,exports){
module.exports = `
t112.5
v20
l4

<<
/:
e16 r8 e16 r r r
e16 r8 e16 r r r
e16 r8 e16 r r e32 r32 e16 r8
e16 r8 e16 r r r

e16 r8 e16 r r r
e16 r8 e16 r r r
e16 r8 e16 r b8 a+8 f+8 d+8
e16 r8 e16 r r r
:/2

f16 r8 f16 r r r
f16 r8 f16 r r r
f16 r8 f16 r r r
e16 r8 e16 r r8 > d16 e16 c16 < b16 a16 g16
f16 r8 f16 r r r
f16 r8 f16 r r r
f16 r8 f16 r r r
e16 r8 e16 r r r
e16 r8 e16 r r r
e16 r8 e16 r r r
r8 > c8 < b8 g8 a8 f+8 d+8 f8

e16 r8 e16 r r r
e16 r8 e16 r r r
e16 r8 e16 r r e32 r32 e16 r8
e16 r8 e16 r r r

e16 r8 e16 r r r
e16 r8 e16 r r r
e16 r8 e16 r b8 a+8 f+8 d+8
e16 r8 e16 r r r
`;

},{}],9:[function(require,module,exports){
module.exports = `
t112.5

/:
  v10
  l32
  o3

  /: <b> e :/32
  /: d g :/32
  /: c+ f+ :/32
  /: c f :/8
  
  l8
  b a+ f+ d+

  r r r r
  r r r r
:/

l4
o4
r r8 b16 > c16 d e
c < b > e2 <
r r8 g16 a16 b > c <
f+16 r8 f+16 r r r <<
r r8 e16 f16 g8 a16 b16 b8 > c16 d16
r > e f b >
c < b e g
b16 r8 b16 r r r
f+16 r8 f+16 r r r
b16 r8 b16 r r r
l8 r c < b g a f+ d+ f
  
v10
l32
o3

/: <b> e :/32
/: d g :/32
/: c+ f+ :/32
/: c f :/8

l8
b a+ f+ d+

r r r r
r r r r
`;

},{}],10:[function(require,module,exports){
module.exports = `

t112.5
v15
l20

l32
/:
o1 c r r r
o20 c r r r
o4 g r r r
r r r r
o20 c r c r
r r r r
o4 g r r r
o1 c r r r
:/35
`
;

},{}],11:[function(require,module,exports){
module.exports = `
t112.5
v25

/:
  o4
  l2
  e b a+ > e <
  b8 g16 e16 r4 r
  r r

  e b a+ > f+
  e8 d16 < b16 r4
  l8 b a+ f+ d+
  l16 e r r e l4 r r r
:/

l4
r r8 e16 f16 g a
f e b2
r r8 b16 > c16 d e <
b16 r8 b16 r r r
r r8 e16 f16 g8 a16 b16 b8 > c16 d16
r e d g
e d < b > d
e16 r8 e16 r r r
< b16 r8 b16 r r r
> e16 r8 e16 r r r
l8 r c < b g a f+ d+ f
  
o4
l2
e b a+ > e <
b8 g16 e16 r4 r
r r

e b a+ > f+
e8 d16 < b16 r4
l8 b a+ f+ d+
l16 e r r e l4 r r r
`;

},{}],12:[function(require,module,exports){
window.SMB2 = {
  PWM1: require('./top.js'),
  PWM2: require('./bottom.js'),
  TRIANGLE: require('./bass.js'),
  NOISE: require('./drums.js'),
};

},{"./bass.js":13,"./bottom.js":14,"./drums.js":15,"./top.js":16}],13:[function(require,module,exports){
module.exports =
`
t200
v25
o3
l12
d d-6 c < b6 g f6 e d4 > d4 < d4 g4

l4
c g c g
< b > g < b > g
< b- > g < b- > g
< a > g < a > g
f > f < f+ > f+ <
g > g < a > a <
d f < g > g
c1
`

},{}],14:[function(require,module,exports){
module.exports =
`

t200
v25

o4
l12
b b-6 a f6 d c6 < b b4 > b4 < b2
o5
c6 < e g6 > c4 < e g6 > c < e- f+ b > e6 < b b2
b-6 d g6 b-4 d g6 b- e a > d e6 d2 e
a6 g a6 f4 a g6 f+
e6 e- e6 c4 < a b6 > d-
d6 c d6 < g4 > c < b6 g g1
`;

},{}],15:[function(require,module,exports){
module.exports =
`
t200
v10
r12 r4 r2 r1
l24
o5
/:
r4 c r r r r r
r4 c r r r r r
r4 c r r r r r
r4 c r c r c r
:/4

`

},{}],16:[function(require,module,exports){
module.exports =
`
t200
v25

o5
l12
g f+6 f d6 < b a6 a- g4 > g4 < g2
o5
g6 c e6 g4 c e6 g < b > e- g b6 a a2
g6 < b > d6 g4 < b > d6 g d- e g b6 a2 b >
c6 < b > c6 < a4 > c < b6 a
g6 f+ g6 e4 d- d6 e
f6 e f6 < b4 > e d6 c c1

`;

},{}]},{},[1]);

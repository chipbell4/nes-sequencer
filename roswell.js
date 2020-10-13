(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.Roswell = {
  PWM1: require('./melody.js'),
  PWM2: require('./chords.js'),
  TRIANGLE: require('./bass.js'),
  NOISE: require('./drums.js'),
}

},{"./bass.js":2,"./chords.js":3,"./drums.js":4,"./melody.js":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
o4 c r r r
o1 c r r r
:/8
`
;

},{}],5:[function(require,module,exports){
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

},{}]},{},[1]);

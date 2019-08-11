(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = {
  tempo: 120,
  octave: 4,
  length: 4,
  velocity: 100,
  quantize: 75,
  loopCount: 2
};
},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Syntax = require("./Syntax");
var DefaultParams = require("./DefaultParams");
var MMLParser = require("./MMLParser");
var ITERATOR = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";

var MMLIterator = function () {
  function MMLIterator(source) {
    _classCallCheck(this, MMLIterator);

    this.source = source;

    this._commands = new MMLParser(source).parse();
    this._commandIndex = 0;
    this._processedTime = 0;
    this._iterator = null;
    this._octave = DefaultParams.octave;
    this._noteLength = [DefaultParams.length];
    this._velocity = DefaultParams.velocity;
    this._quantize = DefaultParams.quantize;
    this._tempo = DefaultParams.tempo;
    this._infiniteLoopIndex = -1;
    this._loopStack = [];
    this._done = false;
  }

  _createClass(MMLIterator, [{
    key: "hasNext",
    value: function hasNext() {
      return this._commandIndex < this._commands.length;
    }
  }, {
    key: "next",
    value: function next() {
      if (this._done) {
        return { done: true, value: null };
      }

      if (this._iterator) {
        var iterItem = this._iterator.next();

        if (!iterItem.done) {
          return iterItem;
        }
      }

      var command = this._forward(true);

      if (isNoteEvent(command)) {
        this._iterator = this[command.type](command);
      } else {
        this._done = true;
        return { done: false, value: { type: "end", time: this._processedTime } };
      }

      return this.next();
    }
  }, {
    key: ITERATOR,
    value: function value() {
      return this;
    }
  }, {
    key: "_forward",
    value: function _forward(forward) {
      while (this.hasNext() && !isNoteEvent(this._commands[this._commandIndex])) {
        var command = this._commands[this._commandIndex++];

        this[command.type](command);
      }

      if (forward && !this.hasNext() && this._infiniteLoopIndex !== -1) {
        this._commandIndex = this._infiniteLoopIndex;

        return this._forward(false);
      }

      return this._commands[this._commandIndex++] || {};
    }
  }, {
    key: "_calcDuration",
    value: function _calcDuration(noteLength) {
      var _this = this;

      if (noteLength[0] === null) {
        noteLength = this._noteLength.concat(noteLength.slice(1));
      }

      var prev = null;
      var dotted = 0;

      noteLength = noteLength.map(function (elem) {
        switch (elem) {
          case null:
            elem = prev;
            break;
          case 0:
            elem = dotted *= 2;
            break;
          default:
            prev = dotted = elem;
            break;
        }

        var length = elem !== null ? elem : DefaultParams.length;

        return 60 / _this._tempo * (4 / length);
      });

      return noteLength.reduce(function (a, b) {
        return a + b;
      }, 0);
    }
  }, {
    key: "_calcNoteNumber",
    value: function _calcNoteNumber(noteNumber) {
      return noteNumber + this._octave * 12 + 12;
    }
  }, {
    key: Syntax.Note,
    value: function value(command) {
      var _this2 = this;

      var type = "note";
      var time = this._processedTime;
      var duration = this._calcDuration(command.noteLength);
      var noteNumbers = command.noteNumbers.map(function (noteNumber) {
        return _this2._calcNoteNumber(noteNumber);
      });
      var quantize = this._quantize;
      var velocity = this._velocity;

      this._processedTime = this._processedTime + duration;

      return arrayToIterator(noteNumbers.map(function (noteNumber) {
        return { type: type, time: time, duration: duration, noteNumber: noteNumber, velocity: velocity, quantize: quantize };
      }));
    }
  }, {
    key: Syntax.Rest,
    value: function value(command) {
      var duration = this._calcDuration(command.noteLength);

      this._processedTime = this._processedTime + duration;
    }
  }, {
    key: Syntax.Octave,
    value: function value(command) {
      this._octave = command.value !== null ? command.value : DefaultParams.octave;
    }
  }, {
    key: Syntax.OctaveShift,
    value: function value(command) {
      var value = command.value !== null ? command.value : 1;

      this._octave += value * command.direction;
    }
  }, {
    key: Syntax.NoteLength,
    value: function value(command) {
      var noteLength = command.noteLength.map(function (value) {
        return value !== null ? value : DefaultParams.length;
      });

      this._noteLength = noteLength;
    }
  }, {
    key: Syntax.NoteVelocity,
    value: function value(command) {
      this._velocity = command.value !== null ? command.value : DefaultParams.velocity;
    }
  }, {
    key: Syntax.NoteQuantize,
    value: function value(command) {
      this._quantize = command.value !== null ? command.value : DefaultParams.quantize;
    }
  }, {
    key: Syntax.Tempo,
    value: function value(command) {
      this._tempo = command.value !== null ? command.value : DefaultParams.tempo;
    }
  }, {
    key: Syntax.InfiniteLoop,
    value: function value() {
      this._infiniteLoopIndex = this._commandIndex;
    }
  }, {
    key: Syntax.LoopBegin,
    value: function value(command) {
      var loopCount = command.value !== null ? command.value : DefaultParams.loopCount;
      var loopTopIndex = this._commandIndex;
      var loopOutIndex = -1;

      this._loopStack.push({ loopCount: loopCount, loopTopIndex: loopTopIndex, loopOutIndex: loopOutIndex });
    }
  }, {
    key: Syntax.LoopExit,
    value: function value() {
      var looper = this._loopStack[this._loopStack.length - 1];

      var index = this._commandIndex;

      if (looper.loopCount <= 1 && looper.loopOutIndex !== -1) {
        index = looper.loopOutIndex;
      }

      this._commandIndex = index;
    }
  }, {
    key: Syntax.LoopEnd,
    value: function value() {
      var looper = this._loopStack[this._loopStack.length - 1];

      var index = this._commandIndex;

      if (looper.loopOutIndex === -1) {
        looper.loopOutIndex = this._commandIndex;
      }
      looper.loopCount -= 1;

      if (0 < looper.loopCount) {
        index = looper.loopTopIndex;
      } else {
        this._loopStack.pop();
      }

      this._commandIndex = index;
    }
  }]);

  return MMLIterator;
}();

function arrayToIterator(array) {
  var index = 0;

  return {
    next: function next() {
      if (index < array.length) {
        return { done: false, value: array[index++] };
      }
      return { done: true };
    }
  };
}

function isNoteEvent(command) {
  return command.type === Syntax.Note || command.type === Syntax.Rest;
}

module.exports = MMLIterator;
},{"./DefaultParams":1,"./MMLParser":3,"./Syntax":5}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Syntax = require("./Syntax");
var Scanner = require("./Scanner");
var NOTE_INDEXES = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

var MMLParser = function () {
  function MMLParser(source) {
    _classCallCheck(this, MMLParser);

    this.scanner = new Scanner(source);
  }

  _createClass(MMLParser, [{
    key: "parse",
    value: function parse() {
      var _this = this;

      var result = [];

      this._readUntil(";", function () {
        result = result.concat(_this.advance());
      });

      return result;
    }
  }, {
    key: "advance",
    value: function advance() {
      switch (this.scanner.peek()) {
        case "c":
        case "d":
        case "e":
        case "f":
        case "g":
        case "a":
        case "b":
          return this.readNote();
        case "[":
          return this.readChord();
        case "r":
          return this.readRest();
        case "o":
          return this.readOctave();
        case ">":
          return this.readOctaveShift(+1);
        case "<":
          return this.readOctaveShift(-1);
        case "l":
          return this.readNoteLength();
        case "q":
          return this.readNoteQuantize();
        case "v":
          return this.readNoteVelocity();
        case "t":
          return this.readTempo();
        case "$":
          return this.readInfiniteLoop();
        case "/":
          return this.readLoop();
        default:
        // do nothing
      }
      this.scanner.throwUnexpectedToken();
    }
  }, {
    key: "readNote",
    value: function readNote() {
      return {
        type: Syntax.Note,
        noteNumbers: [this._readNoteNumber(0)],
        noteLength: this._readLength()
      };
    }
  }, {
    key: "readChord",
    value: function readChord() {
      var _this2 = this;

      this.scanner.expect("[");

      var noteList = [];

      var offset = 0;

      this._readUntil("]", function () {
        switch (_this2.scanner.peek()) {
          case "c":
          case "d":
          case "e":
          case "f":
          case "g":
          case "a":
          case "b":
            noteList.push(_this2._readNoteNumber(offset));
            break;
          case ">":
            _this2.scanner.next();
            offset += 12;
            break;
          case "<":
            _this2.scanner.next();
            offset -= 12;
            break;
          default:
            _this2.scanner.throwUnexpectedToken();
        }
      });

      this.scanner.expect("]");

      return {
        type: Syntax.Note,
        noteNumbers: noteList,
        noteLength: this._readLength()
      };
    }
  }, {
    key: "readRest",
    value: function readRest() {
      this.scanner.expect("r");

      return {
        type: Syntax.Rest,
        noteLength: this._readLength()
      };
    }
  }, {
    key: "readOctave",
    value: function readOctave() {
      this.scanner.expect("o");

      return {
        type: Syntax.Octave,
        value: this._readArgument(/\d+/)
      };
    }
  }, {
    key: "readOctaveShift",
    value: function readOctaveShift(direction) {
      this.scanner.expect(/<|>/);

      return {
        type: Syntax.OctaveShift,
        direction: direction | 0,
        value: this._readArgument(/\d+/)
      };
    }
  }, {
    key: "readNoteLength",
    value: function readNoteLength() {
      this.scanner.expect("l");

      return {
        type: Syntax.NoteLength,
        noteLength: this._readLength()
      };
    }
  }, {
    key: "readNoteQuantize",
    value: function readNoteQuantize() {
      this.scanner.expect("q");

      return {
        type: Syntax.NoteQuantize,
        value: this._readArgument(/\d+/)
      };
    }
  }, {
    key: "readNoteVelocity",
    value: function readNoteVelocity() {
      this.scanner.expect("v");

      return {
        type: Syntax.NoteVelocity,
        value: this._readArgument(/\d+/)
      };
    }
  }, {
    key: "readTempo",
    value: function readTempo() {
      this.scanner.expect("t");

      return {
        type: Syntax.Tempo,
        value: this._readArgument(/\d+(\.\d+)?/)
      };
    }
  }, {
    key: "readInfiniteLoop",
    value: function readInfiniteLoop() {
      this.scanner.expect("$");

      return {
        type: Syntax.InfiniteLoop
      };
    }
  }, {
    key: "readLoop",
    value: function readLoop() {
      var _this3 = this;

      this.scanner.expect("/");
      this.scanner.expect(":");

      var loopBegin = { type: Syntax.LoopBegin };
      var loopEnd = { type: Syntax.LoopEnd };

      var result = [];

      result = result.concat(loopBegin);
      this._readUntil(/[|:]/, function () {
        result = result.concat(_this3.advance());
      });
      result = result.concat(this._readLoopExit());

      this.scanner.expect(":");
      this.scanner.expect("/");

      loopBegin.value = this._readArgument(/\d+/) || null;

      result = result.concat(loopEnd);

      return result;
    }
  }, {
    key: "_readUntil",
    value: function _readUntil(matcher, callback) {
      while (this.scanner.hasNext()) {
        this.scanner.forward();
        if (!this.scanner.hasNext() || this.scanner.match(matcher)) {
          break;
        }
        callback();
      }
    }
  }, {
    key: "_readArgument",
    value: function _readArgument(matcher) {
      var num = this.scanner.scan(matcher);

      return num !== null ? +num : null;
    }
  }, {
    key: "_readNoteNumber",
    value: function _readNoteNumber(offset) {
      var noteIndex = NOTE_INDEXES[this.scanner.next()];

      return noteIndex + this._readAccidental() + offset;
    }
  }, {
    key: "_readAccidental",
    value: function _readAccidental() {
      if (this.scanner.match("+")) {
        return +1 * this.scanner.scan(/\++/).length;
      }
      if (this.scanner.match("-")) {
        return -1 * this.scanner.scan(/\-+/).length;
      }
      return 0;
    }
  }, {
    key: "_readDot",
    value: function _readDot() {
      var len = (this.scanner.scan(/\.+/) || "").length;
      var result = new Array(len);

      for (var i = 0; i < len; i++) {
        result[i] = 0;
      }

      return result;
    }
  }, {
    key: "_readLength",
    value: function _readLength() {
      var result = [];

      result = result.concat(this._readArgument(/\d+/));
      result = result.concat(this._readDot());

      var tie = this._readTie();

      if (tie) {
        result = result.concat(tie);
      }

      return result;
    }
  }, {
    key: "_readTie",
    value: function _readTie() {
      this.scanner.forward();

      if (this.scanner.match("^")) {
        this.scanner.next();
        return this._readLength();
      }

      return null;
    }
  }, {
    key: "_readLoopExit",
    value: function _readLoopExit() {
      var _this4 = this;

      var result = [];

      if (this.scanner.match("|")) {
        this.scanner.next();

        var loopExit = { type: Syntax.LoopExit };

        result = result.concat(loopExit);

        this._readUntil(":", function () {
          result = result.concat(_this4.advance());
        });
      }

      return result;
    }
  }]);

  return MMLParser;
}();

module.exports = MMLParser;
},{"./Scanner":4,"./Syntax":5}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scanner = function () {
  function Scanner(source) {
    _classCallCheck(this, Scanner);

    this.source = source;
    this.index = 0;
  }

  _createClass(Scanner, [{
    key: "hasNext",
    value: function hasNext() {
      return this.index < this.source.length;
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.source.charAt(this.index) || "";
    }
  }, {
    key: "next",
    value: function next() {
      return this.source.charAt(this.index++) || "";
    }
  }, {
    key: "forward",
    value: function forward() {
      while (this.hasNext() && this.match(/\s/)) {
        this.index += 1;
      }
    }
  }, {
    key: "match",
    value: function match(matcher) {
      if (matcher instanceof RegExp) {
        return matcher.test(this.peek());
      }
      return this.peek() === matcher;
    }
  }, {
    key: "expect",
    value: function expect(matcher) {
      if (!this.match(matcher)) {
        this.throwUnexpectedToken();
      }
      this.index += 1;
    }
  }, {
    key: "scan",
    value: function scan(matcher) {
      var target = this.source.substr(this.index);

      var result = null;

      if (matcher instanceof RegExp) {
        var matched = matcher.exec(target);

        if (matched && matched.index === 0) {
          result = matched[0];
        }
      } else if (target.substr(0, matcher.length) === matcher) {
        result = matcher;
      }

      if (result) {
        this.index += result.length;
      }

      return result;
    }
  }, {
    key: "throwUnexpectedToken",
    value: function throwUnexpectedToken() {
      var identifier = this.peek() || "ILLEGAL";

      throw new SyntaxError("Unexpected token: " + identifier);
    }
  }]);

  return Scanner;
}();

module.exports = Scanner;
},{}],5:[function(require,module,exports){
"use strict";

module.exports = {
  Note: "Note",
  Rest: "Rest",
  Octave: "Octave",
  OctaveShift: "OctaveShift",
  NoteLength: "NoteLength",
  NoteVelocity: "NoteVelocity",
  NoteQuantize: "NoteQuantize",
  Tempo: "Tempo",
  InfiniteLoop: "InfiniteLoop",
  LoopBegin: "LoopBegin",
  LoopExit: "LoopExit",
  LoopEnd: "LoopEnd"
};
},{}],6:[function(require,module,exports){
"use strict";

module.exports = require("./MMLIterator");
},{"./MMLIterator":2}],7:[function(require,module,exports){
/**
 * Module for adding effects to existing melodies
 * @module NES.Effects
 * @see NES
 */
module.exports = {
  /**
   * Takes a sequence of melody notes and converts them to a shorter, staccato representation
   * @param {Array} melody The melody to shorten
   * @param {Number} noteReduction The percentage (0 - 1) to reduce the note length by
   * @return Array An updated melody, with shortened notes
   */
  Staccato: function (melody, noteReduction) {
    noteReduction = noteReduction || 0.5
    var newMelody = []
    for (var i = 0; i < melody.length; i++) {
      var shortCycles = Math.round(melody[i].cycles * noteReduction)
      newMelody.push({
        frequency: melody[i].frequency,
        cycles: shortCycles,
        volume: melody[i].volume
      })

      newMelody.push({
        frequency: melody[i + 1] ? melody[i + 1].frequency : melody[i].frequency,
        cycles: melody[i].cycles - shortCycles,
        volume: 0
      })
    }

    return newMelody
  },

  /**
   * Takes a chord of frequencies and converts them into an arpeggiated chords that arpegiates at 60Hz (60 notes per
   * second, the NES limit)
   * @param {Array} frequencies An array of floating-point frequencies
   * @param {Number} cycles The number of cycles to run
   * @param {Number} startVolume The starting volume (0 - 1)
   * @param {Number} endVolume The ending volume (0 - 1), defaults to the starting volume
   * @return {Array} An array of notes that arpeggiates given the passed parameters
   */
  Arpeggio: function (frequencies, cycles, startVolume, endVolume) {
    endVolume = endVolume === undefined ? startVolume : endVolume

    var melody = []
    for (var i = 0; i < cycles; i++) {
      var volume = startVolume + (endVolume - startVolume) * i / cycles
      var frequencyIndex = i % frequencies.length

      melody.push({
        frequency: frequencies[frequencyIndex],
        volume: volume,
        cycles: 1
      })
    }

    return melody
  },

  /**
   * Adds vibrato to a given melody. Typical might look like this: NES.Effects.Vibrato(myMelody, 5, 0.015)
   * @param {Array} melody The melody to add vibrato to
   * @param {Number} vibratoFrequency The frequency at which to oscillate the note
   * @param {Number} vibratoPercentage The percentage to vibrate by.
   * @return {Array} An updated, vibrato melody
   */
  Vibrato: function (melody, vibratoFrequency, vibratoPercentage) {
    var vibratoMelodyComponents = melody.map(function (note) {
      var melody = []

      for (var cycle = 0; cycle < note.cycles; cycle++) {
        var t = cycle / 60
        var offsetRatio = 1 + vibratoPercentage * Math.sin(t * 2 * Math.PI * vibratoFrequency)
        melody.push({
          volume: note.volume,
          cycles: 1,
          frequency: note.frequency * offsetRatio
        })
      }

      return melody
    })

    // flatten
    return Array.prototype.concat.apply([], vibratoMelodyComponents)
  }
}

},{}],8:[function(require,module,exports){
var MMLIterator = require('mml-iterator')
var Effects = require('./effects')

var noteNumberToFrequency = function (noteNumber) {
  // a440 is 69
  var halftoneOffset = noteNumber - 69
  return 440 * Math.pow(2, halftoneOffset / 12)
}

var cycles = function (duration) {
  var alpha = 100000000
  return Math.round(Math.round(duration * 60 * alpha) / alpha)
}

/**
 * A module for working with MML
 * @module NES.Mml
 * @see NES
 */
module.exports = {
  /**
   * Converts an mml string to an array of notes for the sequencer
   * @param {String} mmlString A string of mml to convert. Something like "t100 cde2fg^"
   * @return {Array} An array of notes that can be passed to the sequencer's play method
   */
  mmlToMelody: function (mmlString) {
    var iterator = new MMLIterator(mmlString)

    // each entry is a "chord grouping", potentially with one note per grouping
    var chordGroupings = [[]]
    var current = iterator.next()
    var lastTime = current.value.time

    // handle the starting rest as well
    if (lastTime > 0) {
      chordGroupings[chordGroupings.length - 1].push({
        frequency: 440,
        volume: 0,
        cycles: cycles(lastTime)
      })
      chordGroupings.push([])
    }

    var lastNoteEnd = current.value.duration + lastTime
    while (current.value.type !== 'end') {
      // check if we need to add a rest. We'll need to add a rest if the current note ends before the next one starts
      if (current.value.time > lastNoteEnd) {
        var restLength = current.value.time - lastNoteEnd
        chordGroupings.push([{
          frequency: noteNumberToFrequency(current.value.noteNumber),
          volume: 0,
          cycles: cycles(restLength)
        }])
        chordGroupings.push([])
      } else if (current.value.time !== lastTime) {
        // if our current note doesn't occur at the same time as the last one, create a new chord grouping
        chordGroupings.push([])
      }

      // push the current note onto the end of the current chord grouping
      chordGroupings[chordGroupings.length - 1].push({
        frequency: noteNumberToFrequency(current.value.noteNumber),
        volume: current.value.velocity / 127,
        cycles: cycles(current.value.duration)
      })

      lastTime = current.value.time
      lastNoteEnd = current.value.duration + current.value.time

      current = iterator.next()
    }

    var melody = []
    chordGroupings.forEach(function (chord) {
      if (chord.length === 1) {
        return melody.push(chord[0])
      }

      var frequencies = chord.map(function (note) {
        return note.frequency
      })
      melody = melody.concat(Effects.Arpeggio(frequencies, chord[0].cycles, chord[0].volume))
    })

    melody.push({ frequency: 440, volume: 0, cycles: 1 })

    return melody
  }
}

},{"./effects":7,"mml-iterator":6}],9:[function(require,module,exports){
/**
 * A few helpful functions for music-based calculations
 * @module NES.MusicTools
 * @see NES
 */
module.exports = {
  /**
   * Calculates the frequency for a given note in scientific pitch notation
   * @param {String} note A string to convert (like "A5", "Db3" or "G#4")
   * @return {Number} The frequency of the note
   */
  frequency: function (note) {
    var octave = Number(note[note.length - 1])
    var pitch = note.substr(0, note.length - 1)
    var pitchNames = [
      ['C', 'B#'],
      ['C#', 'Db'],
      'D',
      ['D#', 'Eb'],
      ['E', 'Fb'],
      'F',
      ['F#', 'Gb'],
      'G',
      ['G#', 'Ab'],
      'A',
      ['A#', 'Bb'],
      'B'
    ]

    // find the pitch offset
    var pitchOffset = 0
    for (pitchOffset = 0; pitchOffset < 12; pitchOffset++) {
      if (pitchNames[pitchOffset] instanceof Array && pitchNames[pitchOffset].indexOf(pitch) !== -1) {
        break
      } else if (pitchNames[pitchOffset] === pitch) {
        break
      }
    }

    var oneSemitone = Math.pow(2, 1 / 12)
    var semitones = (octave - 4) * 12 + pitchOffset
    var c4 = 261.63
    return c4 * Math.pow(oneSemitone, semitones)
  }
}

},{}],10:[function(require,module,exports){
(function () {
  /**
   * The main wrapper module for NES, providing access to the submodules
   * @module NES
   */
  var NES = {
    Effects: require('./effects'),
    MusicTools: require('./music-tools'),
    Oscillators: require('./oscillators'),
    Sequencer: require('./sequencer'),
    Mml: require('./mml')
  }

  if (typeof window !== 'undefined') {
    window.NES = NES
  }
  if (typeof module !== 'undefined') {
    module.exports = NES
  }
})()

},{"./effects":7,"./mml":8,"./music-tools":9,"./oscillators":11,"./sequencer":12}],11:[function(require,module,exports){
/**
 * Handles oscillators and their configuration
 * @module NES.Oscillators
 */
module.exports = (function () {
  var context
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext
    context = new AudioContext()
  } catch (e) {
    var message = 'Web Audio isn\'t supported in this browser!'
    throw new Error(message)
  }

  var oscillators = {}

  var createOscillator = function (options) {
    options = options || {}

    var oscillator = context.createOscillator()

    if (options.frequency) oscillator.frequency.value = options.frequency
    if (options.type) oscillator.type = options.type

    if (options.harmonics) {
      var waveform = context.createPeriodicWave(
        new Float32Array(options.harmonics.real),
        new Float32Array(options.harmonics.imag)
      )
      oscillator.setPeriodicWave(waveform)
    }

    var gain = context.createGain()
    gain.gain.value = 0

    // Some wave forms are simply louder, so we add a global gain option for basic mixing
    var globalGain = context.createGain()
    globalGain.gain.value = options.global_gain || 1

    oscillator.connect(gain)
    gain.connect(globalGain)
    globalGain.connect(context.destination)

    return {
      oscillator: oscillator,
      gain: gain
    }
  }

  var createNoiseOscillator = function () {
    // https://medium.com/web-audio/you-dont-need-that-scriptprocessor-61a836e28b42
    var node = context.createBufferSource()

    var buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
    var data = buffer.getChannelData(0)

    var runLength = 10
    for (var i = 0; i < context.sampleRate * 4; i += runLength) {
      var x = Math.random() < 0.5 ? 0 : 1

      for (var j = 0; j < runLength; j++) {
        data[i + j] = x
      }
    }

    node.buffer = buffer
    node.loop = true

    var gain = context.createGain()
    gain.gain.value = 0
    node.connect(gain)
    gain.connect(context.destination)

    return {
      oscillator: node,
      gain: gain
    }
  }

  var setPulseWidth = function (oscillatorIndex, pulseWidth) {
    // calculate the harmonics for the passed (clamped) pulse width
    pulseWidth = Math.max(0, Math.min(1, pulseWidth))

    var real = [0]
    var imag = [0]
    for (var i = 1; i < 8192; i++) {
      var realTerm = 4 / (i * Math.PI) * Math.sin(Math.PI * i * pulseWidth)
      real.push(realTerm)
      imag.push(0)
    }
    oscillators[oscillatorIndex].oscillator.setPeriodicWave(
      context.createPeriodicWave(new Float32Array(real), new Float32Array(imag)))
  }

  // initialize oscillators
  oscillators.PWM1 = createOscillator({ global_gain: 0.25 })
  setPulseWidth('PWM1', 0.5)
  oscillators.PWM2 = createOscillator({ global_gain: 0.25 })
  setPulseWidth('PWM2', 0.5)
  oscillators.TRIANGLE = createOscillator({ type: 'triangle' })
  oscillators.NOISE = createNoiseOscillator()

  Object.keys(oscillators).forEach(function (key) {
    oscillators[key].oscillator.start(0)
  })

  return {
    /**
     * The AudioContext used for the oscillators. Providing access if it needs to be paused/resumed.
     */
    context: context,

    /**
     * Sets the pulse width of a particular oscillator
     * @param {String} oscillatorIndex The oscillator to set for (PWM1, or PWM2)
     * @param {Number} pulseWidth The new pulse width to set (0 - 1)
     */
    setPulseWidth: setPulseWidth,

    /**
     * Set the pitch of a particular oscillator
     * @param {String} oscillatorIndex The oscillator to set for (PWM1, PWM2, NOISE, TRIANGLE)
     * @param {Number} frequency The frequency in Hz to set to
     * @param {Number} volume The volume to set to (0 - 1)
     */
    setPitch: function (oscillatorIndex, frequency, volume) {
      if (volume !== undefined) {
        volume = Math.max(0, Math.min(1, volume))
        oscillators[oscillatorIndex].gain.gain.value = volume
      }

      if (oscillatorIndex === 'NOISE') {
        // calculate the number of half steps above middle C
        var halfSteps = Math.log(frequency / 261) / Math.log(2) * 12

        console.log(frequency, halfSteps)

        // clamp the value to a 0 - 16 range
        halfSteps = Math.max(Math.min(halfSteps, 15), 0)

        // round down
        halfSteps = Math.floor(halfSteps)

        // map that to a sample rate
        var minSampleRate = 0.1
        var maxSampleRate = 5
        var sampleRate = minSampleRate + (maxSampleRate - minSampleRate) * (halfSteps / 15)

        oscillators[oscillatorIndex].oscillator.playbackRate.value = sampleRate
        return
      }

      oscillators[oscillatorIndex].oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    }
  }
})()

},{}],12:[function(require,module,exports){
var Oscillators = require('./oscillators')

var CYCLE_LENGTH_IN_MS = 1000 / 60
var sequencerInterval = null

var calculateStartCyclesForMelody = function (melody) {
  var currentStartCycle = 0

  return melody.map(function (note) {
    var newNote = {
      frequency: note.frequency,
      volume: note.volume,
      cycles: note.cycles,
      start_cycle: currentStartCycle
    }

    currentStartCycle += note.cycles

    return newNote
  })
}

var initializePitches = function (melodies) {
  Object.keys(melodies).forEach(function (key) {
    Oscillators.setPitch(key, melodies[key][0].frequency, melodies[key][0].volume)
  })
}

/**
 * Handles the sequencing of songs
 * @module NES.Sequencer
 */
module.exports = {
  /**
   * Schedules a melody to be played. melodies, in this case is an object, where the keys are the oscillator type
   * ('PWM1', 'PWM2', 'NOISE', 'TRIANGLE'), and the associated values is an array of objects, each looking like this:
   * { frequency: 440, volume: 0.2, cycles: 10 }, where frequency is in Hz, volume ranges between 0 and 1, and cycles
   * is the number of cpu cycles to use
   * @param {Array} melodies The melody to play
   */
  play: function (melodies) {
    this.stop()

    initializePitches(melodies)

    // calculate the cycle length and start cycle for each melody note
    Object.keys(melodies).forEach(function (key) {
      melodies[key] = calculateStartCyclesForMelody(melodies[key])
    })

    var currentCycle = 0
    sequencerInterval = setInterval(function () {
      Object.keys(melodies).forEach(function (oscillatorType) {
        // find the note that should be playing (based on current cycle), and play it
        melodies[oscillatorType]
          .filter(function (note) {
            return note.start_cycle === currentCycle
          })
          .forEach(function (note) {
            Oscillators.setPitch(oscillatorType, note.frequency, note.volume)
          })
      })
      currentCycle += 1
    }, CYCLE_LENGTH_IN_MS)
  },

  /**
   * Stops all songs, and mutes them
   */
  stop: function () {
    clearInterval(sequencerInterval)

    // mute everything
    var oscillatorTypes = ['PWM1', 'PWM2', 'TRIANGLE', 'NOISE']
    oscillatorTypes.forEach(function (oscillator) {
      Oscillators.setPitch(oscillator, 440, 0)
    })
  },

  CYCLE_LENGTH_IN_MS: CYCLE_LENGTH_IN_MS
}

},{"./oscillators":11}]},{},[10]);

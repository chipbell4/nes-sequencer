var NesSequencer = (function() {

  var context;
  try {
    context = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext();
  } catch(e) {
    var message = 'Web Audio isn\'t supported in this browser!';
    alert(message);
    throw new Error(message);
  }

  var oscillators = {};

  var createOscillator = function(options) {
    options = options || {};

    var oscillator = context.createOscillator();

    if(options.frequency) oscillator.frequency.value = options.frequency;    
    if(options.type) oscillator.type = options.type;

    if(options.harmonics) {
      var waveform = context.createPeriodicWave(
        new Float32Array(options.harmonics.real),
        new Float32Array(options.harmonics.imag)
      );
      oscillator.setPeriodicWave(waveform);
    } 


    var gain = context.createGain();
    gain.gain.value = 0;

    oscillator.connect(gain);
    gain.connect(context.destination);

    return {
      oscillator: oscillator,
      gain: gain
    };
  };

  var createNoiseOscillator = function() {
    // https://medium.com/web-audio/you-dont-need-that-scriptprocessor-61a836e28b42
    var node = context.createBufferSource();
    var buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
    var data = buffer.getChannelData(0);

    for(var i = 0; i < context.sampleRate; i++) {
      data[i] = Math.random();
    }

    node.buffer = buffer;
    node.loop = true;

    var gain = context.createGain();
    gain.gain.value = 0;
    node.connect(gain);

    var bandpass = context.createBiquadFilter();
    bandpass.frequency.value = 440;
    bandpass.type = 'bandpass';
    bandpass.Q = 500;
    gain.connect(bandpass);
    bandpass.connect(context.destination);

    return {
      oscillator: node,
      gain: gain,
      bandpass: bandpass
    };
  };

  return {

    OSCILLATOR_TYPES: {
      PWM1: 0,
      PWM2: 1,
      TRI:  2,
      NOISE: 3
    },

    PULSE_WIDTHS: {
      SQUARE: 0.5,
      QUARTER: 0.25,
      EIGHTH: 0.125,
    },

    init: function(options) {
      // initialize oscillators
      oscillators[this.OSCILLATOR_TYPES.PWM1] = createOscillator();
      this.setPulseWidth(this.OSCILLATOR_TYPES.PWM1, 0.5);
      oscillators[this.OSCILLATOR_TYPES.PWM2] = createOscillator();
      this.setPulseWidth(this.OSCILLATOR_TYPES.PWM2, 0.5);
      oscillators[this.OSCILLATOR_TYPES.TRI] = createOscillator({ type: 'triangle' });
      oscillators[this.OSCILLATOR_TYPES.NOISE] = createNoiseOscillator();

      Object.keys(oscillators).forEach(function(key) {
        oscillators[key].oscillator.start(0);
      });
    },
    
    setPulseWidth: function(oscillatorIndex, pulseWidth) {
      // calculate the harmonics for the passed (clamped) pulse width
      pulseWidth = Math.max(0, Math.min(1, pulseWidth));

      var real = [0], imag = [0];
      for(var i = 1; i < 8192; i++) {
        var realTerm = 4 / (i * Math.PI) * Math.sin(Math.PI * i * pulseWidth);
        real.push(realTerm);
        imag.push(0);
      }
      oscillators[oscillatorIndex].oscillator.setPeriodicWave(
        context.createPeriodicWave(new Float32Array(real), new Float32Array(imag)));
    },

    setPitch: function(oscillatorIndex, frequency, volume) {
      if(volume !== undefined) {
        volume = Math.max(0, Math.min(1, volume));
        oscillators[oscillatorIndex].gain.gain.value = volume;
      }

      if(oscillatorIndex == this.OSCILLATOR_TYPES.NOISE) {
        oscillators[oscillatorIndex].bandpass.frequency.value = frequency;
        return;
      }

      oscillators[oscillatorIndex].oscillator.frequency.setValueAtTime(frequency, 0);
    },

    /**
     * Schedules a melody to be played. melodies, in this case is an object, where the keys are the oscillator type
     * (NesSequencer.OSCILLATOR_TYPES.PWM1), and the associated values is an array of objects, each looking like this:
     * { frequency: 440, volume: 0.2, duration: 1000 }, where frequency is in Hz, volume ranges between 0 and 1, and
     * duration is in millis.
     */
    scheduleMelody: function(melodies) {

      // build a list of start times for each note (as a running sum)
      var startTimes = {};
      var currentNoteIndices = {};
      Object.keys(melodies).forEach(function(key) {
        startTimes[key] = [];
        currentNoteIndices[key] = 0;
        var runningSum = 0;
        melodies[key].forEach(function(note) {
          startTimes[key].push(runningSum);
          runningSum += note.duration;
        });
      });

      var sequencer = this;
      var previousFrame, currentFrame, timeElapsed = 0;

      Object.keys(melodies).forEach(function(key) {
          sequencer.setPitch(key, melodies[key][0].frequency, melodies[key][0].volume);
      });

      var interval = setInterval(function() {
        var finished = Object.keys(melodies).every(function(key) {
          var k = currentNoteIndices[key];
          var endTimeForCurrentNote = startTimes[k] + melodies[key][k].duration;

          return melodies[key][k+1] === undefined && endTimeForCurrentNote < timeElapsed;
        });

        if(finished) { clearInterval(interval); }

        // update frame time
        if(previousFrame === undefined) {
          previousFrame = currentFrame = Date.now();
        }
        timeElapsed += currentFrame - previousFrame;
        previousFrame = currentFrame;
        currentFrame = Date.now();

        Object.keys(melodies).forEach(function(key) {

          var k = currentNoteIndices[key];
          var endTimeForCurrentNote = startTimes[key][k] + melodies[key][k].duration;
          var finishedCurrentNote = endTimeForCurrentNote < timeElapsed;

          // if we're at the last note, and we're past the last duration, turn off
          if(melodies[key][k+1] === undefined && finishedCurrentNote) {
            sequencer.setPitch(key, 440, 0);
            return;
          }
          
          // if we're at the last note, break out
          if(melodies[key][k+1] === undefined) {
            return;
          }
          
          // if we haven't crossed into the next note, we've nothing to do
          if(!finishedCurrentNote) {
            return;
          }

          // otherwise, our time has just crossed over into the next note, update everything
          currentNoteIndices[key]++;
          sequencer.setPitch(key, melodies[key][k+1].frequency, melodies[key][k+1].volume);
        });
      }, 10);
    },
  };
})();

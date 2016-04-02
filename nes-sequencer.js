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

    init: function(options) {
      // initialize oscillators
      oscillators[this.OSCILLATOR_TYPES.PWM1] = createOscillator();
      oscillators[this.OSCILLATOR_TYPES.PWM2] = createOscillator();
      oscillators[this.OSCILLATOR_TYPES.TRI] = createOscillator();
      oscillators[this.OSCILLATOR_TYPES.NOISE] = createNoiseOscillator();

      Object.keys(oscillators).forEach(function(key) {
        oscillators[key].oscillator.start(0);
      });
    },

    setPitch: function(oscillatorIndex, frequency, volume) {
      volume = Math.max(0, Math.min(1, volume));
      oscillators[oscillatorIndex].gain.gain.value = volume;

      if(oscillatorIndex === this.OSCILLATOR_TYPES.NOISE) {
        return;
      }

      oscillators[oscillatorIndex].oscillator.frequency.value = frequency;
    },
  };
})();

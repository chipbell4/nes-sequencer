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

    var gain = context.createGain();
    gain.gain.value = 0;

    oscillator.connect(gain);
    gain.connect(context.destination);

    return {
      oscillator: oscillator,
      gain: gain
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
      oscillators[this.OSCILLATOR_TYPES.NOISE] = createOscillator();

      Object.keys(oscillators).forEach(function(key) {
        oscillators[key].oscillator.start(0);
      });
    },

    setPitch: function(oscillatorIndex, frequency, volume) {
      oscillators[oscillatorIndex].oscillator.frequency.value = frequency;

      volume = Math.max(0, Math.min(1, volume));
      oscillators[oscillatorIndex].gain.gain.value = volume;
    },
  };
})();

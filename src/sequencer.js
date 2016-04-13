NES.Sequencer = (function() {
  var sequencerInterval = null;

  return {
    start: function(melody) {
      this.stop();
    },

    stop: function() {
      clearInterval(sequencerInterval);

      // mute everything
      ['PWM1', 'PWM2', 'TRIANGLE', 'NOISE'].forEach(function(oscillator) {
        NES.Oscillators.setPitch(oscillator, 440, 0);
      });
    },
  };
})();

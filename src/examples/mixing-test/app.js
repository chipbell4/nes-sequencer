var MixingTest = {
  melody: {},
  duration: 750,
  generateMelody: function(beatToPlayOn, frequency, repeatCount) {
    var rawMelody = [1, 2, 3, 4].map(function(beat) {
      var volume = beat == beatToPlayOn ? 1 : 0;
      return {
        duration: MixingTest.duration,
        volume: volume,
        frequency: frequency
      };

    });
    
    var melody = [];
    for(var i = 0; i < repeatCount; i++) {
      melody = melody.concat(rawMelody);
    }

    return melody;
  },
};

MixingTest.melody.PWM1 = MixingTest.generateMelody(1, 440, 8);
NES.Oscillators.setPulseWidth('PWM1', 0.25);
MixingTest.melody.PWM2 = MixingTest.generateMelody(2, 440 * 2 / 3, 8);
NES.Oscillators.setPulseWidth('PWM2', 0.5);
MixingTest.melody.TRIANGLE = MixingTest.generateMelody(3, 440 / 4, 8);
MixingTest.melody.NOISE = MixingTest.generateMelody(4, 1000, 8);

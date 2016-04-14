NES.Sequencer = (function() {
  var sequencerInterval = null;

  var calculateStartTimes = function(melodies) {
    var startTimes = {};
    Object.keys(melodies).forEach(function(key) {
      startTimes[key] = [];
      var runningSum = 0;
      melodies[key].forEach(function(note) {
        startTimes[key].push(runningSum);
        runningSum += note.duration;
      });
    });

    return startTimes;
  };

  var initializePitches = function(melodies) {
    Object.keys(melodies).forEach(function(key) {
      NES.Oscillators.setPitch(key, melodies[key][0].frequency, melodies[key][0].volume);
    });
  };

  return {
    /**
     * Schedules a melody to be played. melodies, in this case is an object, where the keys are the oscillator type
     * (NesSequencer.OSCILLATOR_TYPES.PWM1), and the associated values is an array of objects, each looking like this:
     * { frequency: 440, volume: 0.2, duration: 1000 }, where frequency is in Hz, volume ranges between 0 and 1, and
     * duration is in millis.
     */
    play: function(melodies) {
      this.stop();

      var startTimes = calculateStartTimes(melodies);
      var currentNoteIndices = {};
      Object.keys(melodies).forEach(function(key) {
        currentNoteIndices[key] = 0;
      });

      initializePitches(melodies);

      var previousFrame, currentFrame, timeElapsed = 0;
      sequencerInterval = setInterval(function() {
         
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
          NES.Oscillators.setPitch(key, melodies[key][k+1].frequency, melodies[key][k+1].volume);
        });
      }, 10);
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

var RHYTHM = (function() {
  var durations = {
    Q: NES.MusicTools.duration(Megaman2.tempo, 1),
    E: NES.MusicTools.duration(Megaman2.tempo, 0.5),
    S: NES.MusicTools.duration(Megaman2.tempo, 0.25)
  };
  var volumes = {
    0: 0,
    1: 0.2
  };

  var phrase1Durations = 'ESSESSEEESSEEEEEEEE';
  var phrase2Durations = 'ESSESSEEEEEEEEEEEE';
  var phrase3Durations = 'EEEEQEEEEQQEE';
  var fullDurations = phrase1Durations + phrase2Durations + phrase2Durations + phrase3Durations;

  var phrase1Rests = '0111111101111110111';
  var phrase2Rests = '011111110101010101';
  var phrase3Rests = '0111101111011';
  var fullRests = phrase1Rests + phrase2Rests + phrase2Rests + phrase3Rests;

  var raw = [];
  var N = fullRests.length;
  for(var i = 0; i < N; i++) {
    raw.push({
      frequency: 440,
      duration: durations[fullDurations[i]],
      volume: volumes[fullRests[i]],
    });
  }

  return raw;
})();

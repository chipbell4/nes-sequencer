var RHYTHM = (function() {
  var tempo = 160;
  var durations = {
    Q: MusicTools.duration(160, 1),
    E: MusicTools.duration(160, 0.5),
    S: MusicTools.duration(160, 0.25)
  };

  var phrase1 = 'ESSESSEEESSEEEEEEEE';
  var phrase2 = 'ESSESSEEEEEEEEEEEE';
  var phrase3 = 'EEEEQEEEEQQEE';

  return (phrase1 + phrase2 + phrase2 + phrase3).split('').map(function(durationName) {
    return durations[durationName];
  });
})();

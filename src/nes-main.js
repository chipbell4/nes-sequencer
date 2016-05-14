(function() {
  var NES = {
    Effects: require('./effects'),
    MusicTools: require('./music-tools'),
    Oscillators: require('./oscillators'),
    Sequencer: require('./sequencer'),
  };

  if(typeof window !== 'undefined') {
    window.NES = NES;
  }
  if(typeof module !== 'undefined') {
    module.exports = NES;
  } 
})();

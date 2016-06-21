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

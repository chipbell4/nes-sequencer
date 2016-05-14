(function() {
  var NES = {};

  if(typeof module !== 'undefined') {
    module.exports = NES;
  } else if(typeof window !== 'undefined') {
    window.NES = NES;
  } else {
    throw Error('Nothing to attach to');
  }
})();

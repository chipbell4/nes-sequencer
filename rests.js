var RESTS = (function() {
  var phrase1 = '0111111101111110111';
  var phrase2 = '011111110101010101';
  var phrase3 = '0111101111011';

  return (phrase1 + phrase2 + phrase2 + phrase3).split('').map(function(value) {
    return value == '1' ? 0.2 : 0;
  });
})();

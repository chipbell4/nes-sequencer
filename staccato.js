var Staccato = function(melody) {
  var newMelody = [];
  for(var i = 0; i < melody.length; i++) {
    newMelody.push({
      frequency: melody[i].frequency,
      duration: melody[i].duration / 2,
      volume: melody[i].volume
    });
    
    newMelody.push({
      frequency: melody[i + 1] ? melody[i+1].frequency : melody[i].frequency,
      duration: melody[i].duration / 2,
      volume: 0
    });
  }

  return newMelody;
};

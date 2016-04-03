var Staccato = function(melody) {
  var noteReduction = 0.3;
  var newMelody = [];
  for(var i = 0; i < melody.length; i++) {
    newMelody.push({
      frequency: melody[i].frequency,
      duration: melody[i].duration * noteReduction,
      volume: melody[i].volume
    });
    
    newMelody.push({
      frequency: melody[i + 1] ? melody[i+1].frequency : melody[i].frequency,
      duration: melody[i].duration * (1 - noteReduction),
      volume: 0
    });
  }

  return newMelody;
};

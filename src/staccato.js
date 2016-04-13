var Staccato = function(melody, noteReduction) {
  var noteReduction = noteReduction || 0.5;
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

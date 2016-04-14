NES.Effects = {
  Staccato: function(melody, noteReduction) {
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
  },

  Arpeggio: function(frequencies, duration, startVolume, endVolume) {
    endVolume = endVolume === undefined ? startVolume : endVolume;
    var noteDuration = 1 / 60 * 1000; // 60Hz refresh rate on NES
    var totalNotes = duration / noteDuration;

    var melody = [];
    for(var i = 0; i < totalNotes; i++) {
      var volume = startVolume + (endVolume - startVolume) * i / totalNotes;
      console.log(volume);
      var frequencyIndex = i % frequencies.length;

      melody.push({
        frequency: frequencies[frequencyIndex],
        volume: volume,
        duration: noteDuration
      });
    }

    return melody;
  },
}

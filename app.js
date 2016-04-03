NesSequencer.init();

var tempo = 160;
var cSharpBass = MusicTools.frequency('C#3');
var bBass = MusicTools.frequency('B3');
var aBass = MusicTools.frequency('A3');
var eighth = MusicTools.duration(tempo, 0.5);
var sixteenth = MusicTools.duration(tempo, 0.25);

var drumRiff = [
  { frequency: 8000, volume: 0.2, duration: eighth },
  { frequency: 8000, volume: 0.2, duration: sixteenth },
  { frequency: 8000, volume: 0.2, duration: sixteenth },
  { frequency: 3000, volume: 0.2, duration: eighth },
  { frequency: 8000, volume: 0.2, duration: sixteenth },
  { frequency: 8000, volume: 0.2, duration: sixteenth },
];
var fullDrumRiff = Staccato(drumRiff);
fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);
fullDrumRiff = fullDrumRiff.concat(fullDrumRiff);

NesSequencer.scheduleMelody(NesSequencer.OSCILLATOR_TYPES.TRI, BASS)
NesSequencer.scheduleMelody(NesSequencer.OSCILLATOR_TYPES.NOISE, fullDrumRiff)

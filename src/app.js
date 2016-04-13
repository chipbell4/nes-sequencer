NesSequencer.init();

var melody = {};
melody[NesSequencer.OSCILLATOR_TYPES.PWM1] = MELODY1;
melody[NesSequencer.OSCILLATOR_TYPES.PWM2] = MELODY2;
melody[NesSequencer.OSCILLATOR_TYPES.TRI] = BASS;
melody[NesSequencer.OSCILLATOR_TYPES.NOISE] = DRUM;

NesSequencer.scheduleMelody(melody);

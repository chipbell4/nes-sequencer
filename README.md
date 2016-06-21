# nes-sequencer
This is a attempt to emulate the NES audio hardware using the Web Audio API. The NES traditionally had 4 oscillators:
* Two pulse-width oscillators with configurable duty cycles of 12.5%, 25%, and 50%
* A triangle wave oscillator (typically used for the bass-line)
* A noise channel

## Getting the project setup, with examples
After cloning the repo, simply run `make all` to concatenate files, and open the provided html file in a browser

## Building the oscillators
The Web Audio API has built-in support for a triangle wave, but the others must be implemented.

For the pulse width oscillator, I was forced to create my own custom `[PeriodicWave](https://www.w3.org/TR/webaudio/#idl-def-PeriodicWave)`
instance after calculating the Fourier series by hand (which came out something similar to series
[here](https://en.wikipedia.org/wiki/Pulse_wave)).

For the noise channel, I created a [buffer source](https://www.w3.org/TR/webaudio/#widl-BaseAudioContext-createBufferSource-AudioBufferSourceNode)
and attached a [custom buffer](https://www.w3.org/TR/webaudio/#widl-BaseAudioContext-createBuffer-AudioBuffer-unsigned-long-numberOfChannels-unsigned-long-length-float-sampleRate)
and filled it with `Math.random()` values. I then also attached a [BiquadFilterNode](https://www.w3.org/TR/webaudio/#widl-BaseAudioContext-createBiquadFilter-BiquadFilterNode)
to allow me to bandpass-filter frequencies to get "high" and "low" noise.

## Basic Pitch Setting etc.
The easiest way to set a pitch is using `setPitch`:
```javascript
NES.Oscillator.setPitch(NesSequencer.OSCILLATOR_TYPES.PWM1, 880, 0.1);
NES.Oscillator.setPitch(NesSequencer.OSCILLATOR_TYPES.PWM2, 440, 0.1);
NES.Oscillator.setPitch(NesSequencer.OSCILLATOR_TYPES.TRI, 220, 0.1);
NES.Oscillator.setPitch(NesSequencer.OSCILLATOR_TYPES.NOISE, 100, 0.1);
```

You can change the pulse width as well
```javascript
NES.Oscillator.setPulseWidth(NesSequencer.OSCILLATOR_TYPES.PWM1, 0.25);
```

## Building songs
Building songs is fairly easy, by passing an object to `play`. The object will have keys for each oscillator,
and arrays for each value. Here's an example
```javascript
var notes = [
  { frequency: 440, duration: 500, volume: 0.1 },
  { frequency: 880, duration: 1000, volume: 0.1 },
  { frequency: 440, duration: 500, volume: 0.1 },
];
var fullMelody = {};
fullMelody[NesSequencer.OSCILLATOR_TYPES.PWM1] = notes;
NES.Sequencer.play(fullMelody);
```

# nes-sequencer
This is a attempt to emulate the NES audio hardware using the Web Audio API. The NES traditionally had 4 oscillators:
* Two pulse-width oscillators with configurable duty cycles of 12.5%, 25%, and 50%
* A triangle wave oscillator (typically used for the bass-line)
* A noise channel

## Getting the project setup, with examples
After cloning the repo, simply run
```
npm install
make all
```
to concatenate files, and open the provided html file in a browser

## Docs
Also, `make docs` will also build the docs and dump them into a `docs` folder, which you can peek through if you need.

## Building songs
Building songs is fairly easy, by passing an object to `play`. The object will have keys for each oscillator,
and arrays for each value. Here's an example
```javascript
var notes = [
  { frequency: 440, cycles: 30, volume: 0.1 },
  { frequency: 880, cycles: 60, volume: 0.1 },
  { frequency: 440, cycles: 30, volume: 0.1 },
];
var fullMelody = {};
fullMelody[NesSequencer.OSCILLATOR_TYPES.PWM1] = notes;
NES.Sequencer.play(fullMelody);
```
Note that all time units are provided in *integer cycles*. The cycles correspond to the NES' APU processor speed, which
was 60Hz.

There is also [MML](https://en.wikipedia.org/wiki/Music_Macro_Language) support which can make writing songs
considerably easier. You can see [here in the Kart Kingdom example](https://github.com/chipbell4/nes-sequencer/blob/master/src/examples/kk/melody.js#L3)
how you might go about that.

## Building the oscillators
The Web Audio API has built-in support for a triangle wave, but the others must be implemented.

For the pulse width oscillator, I was forced to create my own custom [PeriodicWave](https://www.w3.org/TR/webaudio/#idl-def-PeriodicWave)
instance after calculating the Fourier series by hand (which came out something similar to series
[here](https://en.wikipedia.org/wiki/Pulse_wave)).

For the noise channel, I created a [buffer source](https://www.w3.org/TR/webaudio/#widl-BaseAudioContext-createBufferSource-AudioBufferSourceNode)
and attached a [custom buffer](https://www.w3.org/TR/webaudio/#widl-BaseAudioContext-createBuffer-AudioBuffer-unsigned-long-numberOfChannels-unsigned-long-length-float-sampleRate)
and filled it with `Math.random()` values. I then also attached a [BiquadFilterNode](https://www.w3.org/TR/webaudio/#widl-BaseAudioContext-createBiquadFilter-BiquadFilterNode)
to allow me to bandpass-filter frequencies to get "high" and "low" noise.

## Basic Pitch Setting etc.
The easiest way to set a pitch is using `setPitch`:
```javascript
NES.Oscillator.setPitch('PWM1', 880, 0.1);
NES.Oscillator.setPitch('PWM2', 440, 0.1);
NES.Oscillator.setPitch('TRI' 220, 0.1);
NES.Oscillator.setPitch('NOISE', 100, 0.1);
```

You can change the pulse width as well
```javascript
NES.Oscillator.setPulseWidth('PWM1', 0.25);
```

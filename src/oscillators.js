/**
 * Handles oscillators and their configuration
 * @module NES.Oscillators
 */
module.exports = (function () {
  var context
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext
    context = new AudioContext()
  } catch (e) {
    var message = 'Web Audio isn\'t supported in this browser!'
    throw new Error(message)
  }

  var oscillators = {}

  var createOscillator = function (options) {
    options = options || {}

    var oscillator = context.createOscillator()

    if (options.frequency) oscillator.frequency.value = options.frequency
    if (options.type) oscillator.type = options.type

    if (options.harmonics) {
      var waveform = context.createPeriodicWave(
        new Float32Array(options.harmonics.real),
        new Float32Array(options.harmonics.imag)
      )
      oscillator.setPeriodicWave(waveform)
    }

    var gain = context.createGain()
    gain.gain.value = 0

    // Some wave forms are simply louder, so we add a global gain option for basic mixing
    var globalGain = context.createGain()
    globalGain.gain.value = options.global_gain || 1

    oscillator.connect(gain)
    gain.connect(globalGain)
    globalGain.connect(context.destination)

    return {
      oscillator: oscillator,
      gain: gain
    }
  }

  var createNoiseOscillator = function () {
    // https://medium.com/web-audio/you-dont-need-that-scriptprocessor-61a836e28b42
    var node = context.createBufferSource()
    var buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
    var data = buffer.getChannelData(0)

    for (var i = 0; i < context.sampleRate; i++) {
      data[i] = Math.random()
    }

    node.buffer = buffer
    node.loop = true

    var gain = context.createGain()
    gain.gain.value = 0
    node.connect(gain)

    var bandpass = context.createBiquadFilter()
    bandpass.frequency.value = 440
    bandpass.type = 'bandpass'
    bandpass.Q = 500
    gain.connect(bandpass)
    bandpass.connect(context.destination)

    return {
      oscillator: node,
      gain: gain,
      bandpass: bandpass
    }
  }

  var setPulseWidth = function (oscillatorIndex, pulseWidth) {
    // calculate the harmonics for the passed (clamped) pulse width
    pulseWidth = Math.max(0, Math.min(1, pulseWidth))

    var real = [0]
    var imag = [0]
    for (var i = 1; i < 8192; i++) {
      var realTerm = 4 / (i * Math.PI) * Math.sin(Math.PI * i * pulseWidth)
      real.push(realTerm)
      imag.push(0)
    }
    oscillators[oscillatorIndex].oscillator.setPeriodicWave(
      context.createPeriodicWave(new Float32Array(real), new Float32Array(imag)))
  }

  // initialize oscillators
  oscillators.PWM1 = createOscillator({ global_gain: 0.25 })
  setPulseWidth('PWM1', 0.5)
  oscillators.PWM2 = createOscillator({ global_gain: 0.25 })
  setPulseWidth('PWM2', 0.5)
  oscillators.TRIANGLE = createOscillator({ type: 'triangle' })
  oscillators.NOISE = createNoiseOscillator()

  Object.keys(oscillators).forEach(function (key) {
    oscillators[key].oscillator.start(0)
  })

  return {

    /**
     * Sets the pulse width of a particular oscillator
     * @param {String} oscillatorIndex The oscillator to set for (PWM1, or PWM2)
     * @param {Number} pulseWidth The new pulse width to set (0 - 1)
     */
    setPulseWidth: setPulseWidth,

    /**
     * Set the pitch of a particular oscillator
     * @param {String} oscillatorIndex The oscillator to set for (PWM1, PWM2, NOISE, TRIANGLE)
     * @param {Number} frequency The frequency in Hz to set to
     * @param {Number} volume The volume to set to (0 - 1)
     */
    setPitch: function (oscillatorIndex, frequency, volume) {
      if (volume !== undefined) {
        volume = Math.max(0, Math.min(1, volume))
        oscillators[oscillatorIndex].gain.gain.value = volume
      }

      if (oscillatorIndex === 'NOISE') {
        oscillators[oscillatorIndex].bandpass.frequency.value = frequency
        return
      }

      oscillators[oscillatorIndex].oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    }
  }
})()

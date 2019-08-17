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
    var oscillatorGain = context.createGain()
    oscillatorGain.gain.value = options.oscillator_gain || 1

    oscillator.connect(gain)
    gain.connect(oscillatorGain)
    oscillatorGain.connect(context.destination)

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

    var runLength = 10
    for (var i = 0; i < context.sampleRate * 4; i += runLength) {
      var x = Math.random() < 0.5 ? 0 : 1

      for (var j = 0; j < runLength; j++) {
        data[i + j] = x
      }
    }

    node.buffer = buffer
    node.loop = true

    var gain = context.createGain()
    gain.gain.value = 0
    node.connect(gain)
    gain.connect(context.destination)

    return {
      oscillator: node,
      gain: gain
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
  oscillators.PWM1 = createOscillator({ oscillator_gain: 0.25 })
  setPulseWidth('PWM1', 0.5)
  oscillators.PWM2 = createOscillator({ oscillator_gain: 0.25 })
  setPulseWidth('PWM2', 0.5)
  oscillators.TRIANGLE = createOscillator({ type: 'triangle' })
  oscillators.NOISE = createNoiseOscillator()

  Object.keys(oscillators).forEach(function (key) {
    oscillators[key].oscillator.start(0)
  })

  return {
    /**
     * The AudioContext used for the oscillators. Providing access if it needs to be paused/resumed.
     */
    context: context,

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
        // calculate the number of half steps above middle C
        var halfSteps = Math.log(frequency / 261) / Math.log(2) * 12

        // clamp the value to a 0 - 16 range
        halfSteps = Math.max(Math.min(halfSteps, 15), 0)

        // round down
        halfSteps = Math.floor(halfSteps)

        // map that to a sample rate
        var minSampleRate = 0.1
        var maxSampleRate = 5
        var sampleRate = minSampleRate + (maxSampleRate - minSampleRate) * (halfSteps / 15)

        oscillators[oscillatorIndex].oscillator.playbackRate.value = sampleRate
        return
      }

      oscillators[oscillatorIndex].oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    }
  }
})()

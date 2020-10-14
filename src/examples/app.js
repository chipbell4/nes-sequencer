require('./kk/app.js');
require('./roswell/app.js');
require('./smb2/app.js');

const channels = ['PWM1', 'PWM2', 'TRIANGLE', 'NOISE'];
const buttons = document.querySelectorAll('footer button[data-song-id]');
for (const button of buttons) {
    button.addEventListener('click', () => {
        const songId = button.dataset.songId;

        // load that song into the text areas
        for (const channel of channels) {
            document.querySelector(`textarea[data-channel=${channel}]`).value = window[songId][channel];
        }
    });
}

document.getElementById('play').addEventListener('click', () => {
    // play whatever's in the textarea
    const sequencerData = {};
    for (const channel of channels) {
        var textarea = document.querySelector(`textarea[data-channel=${channel}]`);
        try {
            sequencerData[channel] = NES.Mml.mmlToMelody(textarea.value);
        } catch(e) {
            sequencerData[channel] = [
              { frequency: 440, volume: 0 }
            ];
        }
    }

    // play it in the sequencer
    NES.Sequencer.stop();
    NES.Oscillators.context.resume().then(() => {
        NES.Sequencer.play(sequencerData, false);
    });
});

document.getElementById('stop').addEventListener('click', () => NES.Sequencer.stop());
document.getElementById('reset').addEventListener('click', () => {
    for (const channel of channels) {
        var textarea = document.querySelector(`textarea[data-channel=${channel}]`);
        textarea.value = '';
    }
});

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const points = {
  PWM1: [],
  PWM2: [],
  TRIANGLE: [],
  NOISE: [],
};
const MAX_POINTS = 10;
NES.Events.Bus.addEventListener(NES.Events.Types.OSCILLATOR_CHANGE, function(e) {
  points[e.oscillatorIndex].push(Object.assign({ when: Date.now()}, e));
  if (points[e.oscillatorIndex].length > MAX_POINTS) {
    points[e.oscillatorIndex].shift();
  }
});

const drawPoints = (p, color) => {
  const W = canvas.width;
  ctx.fillStyle = color;
  for (let i = 0; i < p.length; i++) {
    const x = W * i / MAX_POINTS;

    const halfStepsFromA = Math.log(p[i].frequency / 440) / Math.log(Math.pow(2, 1/12))
    const y = 70 - halfStepsFromA * 2
    const w = W / MAX_POINTS;
    const h = p[i].volume * 10;

    ctx.fillRect(x, y, W / MAX_POINTS, p[i].volume * 30)
  }
};

const draw = () => {
  requestAnimationFrame(draw);
  
  const W = canvas.width;
  ctx.clearRect(0, 0, W, W);

  // just draw PWM1 for now
  drawPoints(points.PWM1, '#F87068');
  drawPoints(points.PWM2, '#28C020');
  drawPoints(points.TRIANGLE, '#20A0F8');
}
requestAnimationFrame(draw);

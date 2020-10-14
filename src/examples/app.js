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

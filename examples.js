(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
            console.log(e);
            alert(`Invalid data in the ${channel.toLowerCase()} input!`);
            return;
        }
    }

    // play it in the sequencer
    NES.Sequencer.stop();
    NES.Oscillators.context.resume().then(() => {
        NES.Sequencer.play(sequencerData, true);
    });
});

document.getElementById('stop').addEventListener('click', () => NES.Sequencer.stop());

},{}]},{},[1]);

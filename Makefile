all: nes.js megaman2.js

nes.js: src/*.js
	cat $(addprefix src/, music-tools.js nes-sequencer.js staccato.js) > nes.js

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

clean:
	rm -rf *.js

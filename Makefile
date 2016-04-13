NES_FILES := nes-sequencer.js music-tools.js staccato.js

all: nes.js megaman2.js

nes.js: src/*.js
	cat $(addprefix src/, $(NES_FILES)) > nes.js

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

clean:
	rm -rf *.js

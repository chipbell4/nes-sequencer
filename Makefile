NES_FILES := nes-main.js oscillators.js music-tools.js staccato.js

all: nes.js megaman2.js

nes.js: $(addprefix src/, $(NES_FILES))
	cat $(addprefix src/, $(NES_FILES)) > nes.js

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

clean:
	rm -rf *.js

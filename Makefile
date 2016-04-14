NES_FILES := nes-main.js oscillators.js sequencer.js music-tools.js effects.js

all: nes.js megaman2.js arp.js

nes.js: $(addprefix src/, $(NES_FILES))
	cat $(addprefix src/, $(NES_FILES)) > nes.js

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

arp.js: src/examples/arp/app.js
	cat src/examples/arp/app.js > arp.js

clean:
	rm -rf *.js

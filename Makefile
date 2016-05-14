NES_FILES := nes-main.js oscillators.js sequencer.js music-tools.js effects.js

all: nes.js megaman2.js arp.js mixing-test.js kk.js

nes.js: $(addprefix src/, $(NES_FILES))
	cat $(addprefix src/, $(NES_FILES)) > nes.js

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

arp.js: src/examples/arp/app.js
	cat src/examples/arp/app.js > arp.js

mixing-test.js: src/examples/mixing-test/app.js
	cat src/examples/mixing-test/app.js > mixing-test.js

kk.js: src/examples/kk/*.js
	cat src/examples/kk/*.js > kk.js

lint: src/*.js
	node_modules/.bin/standard src/*.js

clean:
	rm -rf *.js

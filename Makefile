NES_FILES := nes-main.js oscillators.js sequencer.js music-tools.js effects.js mml.js

all: nes.js megaman2.js arp.js mixing-test.js kk.js docs roswell.js

nes.js: $(addprefix src/, $(NES_FILES))
	node_modules/.bin/browserify src/nes-main.js > nes.js

examples.js: src/examples/*
	node_modules/.bin/browserify src/examples/app.js > examples.js

docs: $(addprefix src/, $(NES_FILES))
	node_modules/.bin/jsdoc -d docs src

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

arp.js: src/examples/arp/app.js
	cat src/examples/arp/app.js > arp.js

mixing-test.js: src/examples/mixing-test/app.js
	cat src/examples/mixing-test/app.js > mixing-test.js

kk.js: src/examples/kk/*.js
	node_modules/.bin/browserify src/examples/kk/app.js > kk.js

roswell.js: src/examples/roswell/*.js
	node_modules/.bin/browserify src/examples/roswell/app.js > roswell.js

lint: src/*.js
	node_modules/.bin/standard --fix src/*.js

clean:
	rm -rf *.js docs

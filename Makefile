nes.js: src/*.js
	cat src/*.js > nes.js

megaman2.js: src/examples/megaman2/*.js
	cat src/examples/megaman2/*.js > megaman2.js

clean:
	rm *.js

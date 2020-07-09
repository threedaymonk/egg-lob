.PHONY : default clean lint dictionary

NPM_LOCK=package-lock.json

default : public/style.css

dictionary : public/dictionary.json

$(NPM_LOCK) : package.json
	npm install

public/%.css : %.scss $(NPM_LOCK)
	npx sass $< $@

public/dictionary.json : words.txt
	ruby dictionary.rb $< > $@

lint :
	npx eslint public/*.js

clean :
	rm -f public/*.css public/*.map

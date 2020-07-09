.PHONY : default clean lint dictionary serve

NPM_LOCK = package-lock.json
TARGETS = public/style.css public/dictionary.json

default : public/style.css

dictionary : public/dictionary.json

$(NPM_LOCK) : package.json
	npm install

public/%.css : %.scss $(NPM_LOCK)
	npx sass $< $@

public/dictionary.json : words.txt
	ruby dictionary.rb $< > $@

start : $(TARGETS) $(NPM_LOCK)
	npx http-server public

lint :
	npx eslint public/*.js

clean :
	rm -f public/*.css public/*.map

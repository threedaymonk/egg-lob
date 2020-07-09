.PHONY : default clean lint

default : public/style.css

public/%.css : %.scss
	sass $< $@

public/dictionary.json : words.txt
	ruby dictionary.rb $< > $@
lint :
	eslint public/*.js

clean :
	rm -f public/*.css public/*.map

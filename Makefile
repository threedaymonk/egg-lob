.PHONY : default clean lint

default : public/style.css

public/%.css : %.scss
	sass $< $@

lint :
	eslint public/*.js

clean :
	rm -f public/*.css public/*.map

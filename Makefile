.PHONY : default clean

default : public/style.css

public/%.css : %.scss
	sass $< $@

clean :
	rm -f public/*.css public/*.map

.PHONY : default clean

default : style.css

%.css : %.scss
	sass $< $@

clean :
	rm -f *.css *.map

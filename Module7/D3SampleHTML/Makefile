.PHONY: build clean

build: Tristian_Azuara_D3Sample.html 
	@echo "Building"

Tristian_Azuara_D3Sample.html: index.html data/zm_01-10_04-09.csv 
	python3 ./generate.py $^ > $@

clean: 
	@rm -f Tristian_Azuara_D3Sample.html
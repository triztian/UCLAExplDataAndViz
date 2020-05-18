.PHONY: build clean

build: index.html 
	@echo "Building"

index.html: index.src.html data/zm_01-10_04-09.csv 
	python3 ./generate.py $^ > $@

	
clean: 
	@rm -f index.html
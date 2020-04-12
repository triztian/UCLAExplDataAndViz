.PHONY: all clean

all: libsqlitefunctions.dylib

libsqlitefunctions.dylib: extension-functions.c extension-functions-utf.c
	gcc -g -fno-common -dynamiclib \
	-I./sqlite/src -I./sqlite \
	$^ -o $@

clean:
	rm -rf libsqlitefunctions.dylib libsqlitefunctions.dylib.dSYM
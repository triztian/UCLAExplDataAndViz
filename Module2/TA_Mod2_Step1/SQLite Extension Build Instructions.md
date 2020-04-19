# Building SQLite3 `extension-functions.c` in macOS

## Pre-Requisites

  1. A C compiler such as GCC or clang (clang-1103.0.32.29)
  2. [Make v3.81](https://www.gnu.org/software/make/).
  3. [Git v2.20](https://git-scm.com)


> NOTE: I had Xcode 11.2.1 installed which includes a version of clang compiler
> https://developer.apple.com/xcode/

## 1. Clone SQLite3 source

You will need the C headers and source for SQLite3 to build the `extension-functions.c` 
that was provided, to do so clone the SQLite source, in a terminal run the following
command:

```bash
git clone --depth=5 https://github.com/sqlite/sqlite.git sqlitesrc
```

## 2. Build SQLite3 with dynamic extensions enabled

The cloned version of SQLite3 comes with dynamic extensions enabled by default, 
one can disable them by adding the flag `--disable-dynamic-extensions` to the
`./configure` command below, however we won't add such flag for our build.

### Configure SQLite build

```bash
cd sqlitesrc
./configure
```

### Build SQLite3

```bash
make
```

The build will take a few minutes; depending on the computer's CPU power and memory.

After the build is finished there should be a `sqlitesrc/sqlite3` executable
that is able to load dynamic extensions, you can verify the build by running the
following command in a terminal:

```bash
./sqlite/sqlite3 --version
```

With output similar to the following:

```bash
3.32.0 2020-04-09 15:31:22 85d3dc8c50d8dbb8eac1956e8976e861d3b671e03355ca9257060fa3dca51cc4
```

## 2. Setup `extension-functions.c`

First download the source from the link that was provided, you can use `cURL` 
to download it:

```bash
curl "https://raw.githubusercontent.com/planetfederal/sqlite-jdbc/master/src/main/ext/extension-functions.c" --output extension-functions.c
```

 * https://github.com/planetfederal/sqlite-jdbc/blob/master/src/main/ext/extension-functions.c

Make sure that the following definition in the `extension-functions.c` is not 
commented out (around line 100):

```c
#define COMPILE_SQLITE_EXTENSIONS_AS_LOADABLE_MODULE 1
```

## 4. Create the `extension-functions-utf.c` file.

The `extension-functions.c` source makes use of the `sqlite3Utf8CharLen` function
_which_ seems to have been deprecated based on the following discussion:

  * https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg27499.html

The content of the support file `extension-functions-utf.c` is the following, 
copy it to a file that is in the same directory as `extension-funtions.c`:

```c
#define SQLITE_SKIP_UTF8(zIn)             \
	{                                     \
		if ((*(zIn++)) >= 0xc0)           \
		{                                 \
			while ((*zIn & 0xc0) == 0x80) \
			{                             \
				zIn++;                    \
			}                             \
		}                                 \
	}

// Define the `u8` type for the function
typedef unsigned char u8;

int sqlite3Utf8CharLen(const char *zIn, int nByte)
{
	int r = 0;
	const u8 *z = (const u8 *)zIn;
	const u8 *zTerm;
	if (nByte >= 0)
	{
		zTerm = &z[nByte];
	}
	else
	{
		zTerm = (const u8 *)(-1);
	}

	//   assert( z<=zTerm );
	while (*z != 0 && z < zTerm)
	{
		SQLITE_SKIP_UTF8(z);
		r++;
	}
	return r;
}
```

## 5. Build the extension `libsqlitefunctions.dylib`

To simplify our build we're going to make use of a `Makefile` the makefile will
contain the build instructions of our extension, it will setup header include
paths and compile our `extension-functions.c` and `extension-funtions-utf.c` files, 
first create a file called `BuildSQLiteExtension.mk` with the following contents:

```makefile
.PHONY: all clean

all: libsqlitefunctions.dylib

libsqlitefunctions.dylib: extension-functions.c extension-functions-utf.c
	gcc -g -fno-common -dynamiclib \
	-I./sqlite/src -I./sqlite \
	 $^ -o $@

clean:
	rm -rf libsqlitefunctions.dylib libsqlitefunctions.dylib.dSYM
```

Then just run the following command in a terminal:

```bash
make -f BuildSQLiteExtension.mk all
```

The result should be a `libsqlitefunctions.dylib` file in the same directory
where we have our C source and makefile.
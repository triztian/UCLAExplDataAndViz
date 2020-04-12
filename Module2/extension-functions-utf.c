/**
This file is needed to have the extension-functions.c compile

Author: Joe Wilson 
Date: Fri, 31 Aug 2007 10:47:11 -0700

https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg27499.html
*/

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
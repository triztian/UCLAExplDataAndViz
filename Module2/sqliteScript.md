# SQLite3

## Optional Extensions

Pre-requisites for using STDEV, MEDIAN (extended functions)

 * https://github.com/boundlessgeo/sqlite-jdbc/blob/master/src/main/ext/extension-functions.c

 Compile this C source file into a dynamic library as follows:

### Linux

```bash
gcc -fPIC -lm -shared extension-functions.c -o libsqlitefunctions.so
```

### macOS

```bash
gcc -fno-common -dynamiclib extension-functions.c -o libsqlitefunctions.dylib
```

### Windows

Follow the instructions here:

 * https://grasswiki.osgeo.org/wiki/Build_SQLite_extension_on_windows


## SQL Sample

### Step a) Create table

Create the DDL (Data Definition Language) to make the table

```sql
/***** OPTIONAL *****/

/* The first time (to create your database, and than your table) */

/*create a name for your database */
sqlite3 health.sqlitedb

CREATE TABLE mariskdata (
   riskFactors TEXT PRIMARY KEY,
   "Year2006" INTEGER NOT NULL,
   "Year2007" INTEGER NOT NULL,
   "Year2008" INTEGER NOT NULL,
   "Year2009" INTEGER NOT NULL,
   "Year2010" INTEGER NOT NULL
);
```

### Step b) Load csv data
Go into csv mode (to load data in)
In some other DB's you can use CREATE TABLE...SELECT * FROM... (so you won't have 
to do Step a)
*/

```sql
.separator ','
.mode csv

/*.import FILE TABLE     Import data from FILE into TABLE*/
.import Module2-Maryland-RiskFactorsData.csv mariskdata

/*Check table loaded*/
SELECT * FROM mariskdata;

/* Compute count, max, min of year 2006, for 1 row*/
SELECT COUNT(Year2006), MAX(Year2006), MIN(Year2006) FROM mariskdata WHERE riskFactors =
"Asthma: Ever been told by a doctor or other health professional that you had asthma?";

/***** OPTIONAL *****/
/* Compute median, mean, standard deviation of year 2006, for 1 row*/

SELECT load_extension('libsqlitefunctions');

SELECT MEDIAN(Year2006), STDEV(Year2006), AVG(Year2006) FROM mariskdata WHERE riskFactors =
"Asthma: Ever been told by a doctor or other health professional that you had asthma?";

/***** OPTIONAL *****/

/*to quit*/
.q
```

Plenty of commands to run on the command line (i.e. quit, is .q)

 * https://www.sqlite.org/cli.html*/
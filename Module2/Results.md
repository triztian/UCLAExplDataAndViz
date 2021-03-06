# Homework 2 Results

There are 2 zip archives:

  1. `TA_Mod2_Step1.zip`  
    Contains the files that were used for the SQLite3 with extensions 
	solution. It contains the DDL and DML files as well as the extension building
	instructions.

  2. `TA_Mod2_Step2.zip`  
    Contains the python script.

The CSV data file is duplicated for simplicity. The data is Zoom's stock price
from Jan 10, 2020 to Apr 9, 2020.

## SQLite (TA_Mod2_Step1)

After loading the data and extensions in `zm_data.sqlite`

### Extension functions
```
sqlite> SELECT 
   ...> MEDIAN(open), 
   ...> STDEV(adjusted_close), 
   ...> AVG(volume) 
   ...> FROM zm_data;
105.0,23.5378485558845,10286800.0
```

### Built-in functions

```
sqlite> SELECT 
   ...> COUNT(open), 
   ...> MAX(open), 
   ...> MIN(open) 
   ...> FROM zm_data;
63,160.759995,71.0
```

## Python (TA_Mod2_Step2)

After executing the script there should be a `zm_data.python.sqlite` file:

```
./script.py 
          date        open        high         low       close  adjusted_close    volume
0   2020-01-10   73.080002   73.800003   72.250000   73.089996       73.089996   1655100
1   2020-01-13   73.889999   75.580002   73.800003   74.029999       74.029999   3347100
2   2020-01-14   74.320000   75.114998   72.260002   73.160004       73.160004   1909500
3   2020-01-15   73.279999   77.779999   73.199997   76.940002       76.940002   3963500
4   2020-01-16   78.000000   78.790001   75.110001   76.110001       76.110001   2998300
..         ...         ...         ...         ...         ...             ...       ...
58  2020-04-03  124.300003  128.479996  120.110001  128.199997      128.199997  12238100
59  2020-04-06  113.629997  125.175003  108.529999  122.940002      122.940002  25378900
60  2020-04-07  118.004997  118.440002  109.570999  113.750000      113.750000  20166200
61  2020-04-08  115.019997  125.877998  112.500000  117.809998      117.809998  26243300
62  2020-04-09  117.800003  125.500000  114.000000  124.510002      124.510002  15513000

[63 rows x 7 columns]
-----
Median (open) 105.0
STD Deviation (adjusted_close) 23.53784855588452
Average (volume) 10286800.0
Count (open) 63
Maximumg (open) 160.759995
Minumum (open) 71.0
```
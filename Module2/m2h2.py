#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: Tristian Azuara (tristian.azuara@gmail.com)
"""

# Clear out variables (in iPython)
#%reset

### Import libraries for use ###
import os
import csv
import sqlite3

import pandas as pd
import numpy as np

# Setup

# Declare path/file name information
root_path = os.getcwd()

zm_data_csv_filename = "zm_01-10_04-09.csv"
zm_data_csv_filepath = os.path.join(root_path, zm_data_csv_filename)

sqlite_db_filename = "zm_data.python.sqlite"
sqlite_db_filepath = os.path.join(root_path, sqlite_db_filename)

# Declare table name
zm_prices = pd.read_csv(zm_data_csv_filepath, 
						names=["date", "open", "high", 
							"low", "close", "adjusted_close", "volume"])
zm_prices
print(zm_prices)

conn = sqlite3.connect(sqlite_db_filepath)

############### Option 1
# Still use the SQLite database, but perform the computations partly in Pandas

### Multiple ways to interact with the database, i.e. variety of libraries, and APIs'

### This goes back to the 'configurations', you might NOT want to simply load the data only
# into Python, you might want to create a static database, Pandas might be a great data 
# and analysis tool, but a static database (i.e. a known, formal structure for storing
# and accessing data still has its uses

# Step 1, a). Programmatically create a table/store the data in Python, use direct SQL syntax

sql_create_table = """
CREATE TABLE zm_data (
	date 			TEXT PRIMARY KEY,
	open 			REAL NOT NULL,
	high 			REAL NOT NULL,
	low				REAL NOT NULL,
	close			REAL NOT NULL,
	adjusted_close	REAL NOT NULL,
	volume			INTEGER NOT NULL
);
"""

# Open a connection to the SQLite database
c = conn.cursor()

# Execute the DDL (text) above directly
c.execute(sql_create_table)
conn.commit()

# Step 2, b). load the csv file data (other options for this)
#https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.to_sql.html

# We don't use this feature because our CSV data does not have a header row.
# zm_prices.to_sql('zm_data', conn, index=False, if_exists='replace')

# Step 3, c). run some simple queries on the dataframe object itself

#/* Compute median, mean, standard deviation of year 2006, for 1 row*/
print('-----')
print('Median (open)', zm_prices['open'].median())
print('STD Deviation (adjusted_close)', zm_prices['adjusted_close'].std())
print('Average (volume)', zm_prices['volume'].mean())

#/* Compute count, max, min of year 2006, for 1 row*/
print('Count (open)', zm_prices['open'].count())
print('Maximumg (open)', zm_prices['open'].max())
print('Minumum (open)', zm_prices['open'].min())

conn.close()
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar 01 08:05:04 2018

@author: ael-annan
"""

# Clear out variables (in iPython)
#%reset

### Import libraries for use ###
import pandas as pd
import numpy as np
import sqlite3
import csv


# Setup

# Declare path/file name information
rootPath = "/Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module2/Excercises/"
fileNameMARiskFactors = "Module2-Maryland-RiskFactorsData.csv"

csvFileNameMARiskFactors = rootPath+fileNameMARiskFactors

sqliteDBFile = "health.sqlitedb"
sqliteDBFilePath = rootPath+sqliteDBFile

# Declare table name
dfMARiskFactors = pd.read_csv( csvFileNameMARiskFactors )
conn = sqlite3.connect( sqliteDBFilePath )

############### Option 1
# Still use the SQLite database, but perform the computations partly in Pandas

### Multiple ways to interact with the database, i.e. variety of libraries, and APIs'

### This goes back to the 'configurations', you might NOT want to simply load the data only
# into Python, you might want to create a static database, Pandas might be a great data 
# and analysis tool, but a static database (i.e. a known, formal structure for storing
# and accessing data still has its uses
# Step 1, a). Programmatically create a table/store the data in Python, use direct SQL syntax

sqlCreateTable = """ CREATE TABLE mariskdataFromPython (
                                     riskFactors TEXT PRIMARY KEY,
                                       "Year2006" INTEGER NOT NULL,
                                       "Year2007" INTEGER NOT NULL,
                                       "Year2008" INTEGER NOT NULL,
                                       "Year2009" INTEGER NOT NULL,
                                       "Year2010" INTEGER NOT NULL
                                    ); """

# Can even make an 'in memmory' only database with SQLite, i.e. not store on disc
# but this has less uses, each db technology has some difference
#c = sqlite3.connect(":memory:")


#Open a connection to the SQLite database
c = conn.cursor()

#Execute the DDL (text) above directly
c.execute(sqlCreateTable)
conn.commit()


# Step 2, b). load the csv file data (other options for this)
#https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.to_sql.html
dfMARiskFactors.to_sql( 'mariskdataFromPython', conn, index = False, if_exists = 'replace' )

# Step 3, c). run some simple queries on the dataframe object itself

#### This is equivalent to SELECT * FROM mariskdataFromPython WHERE 
#riskFactors = "Asthma: Ever been told by a doctor or other health professional that you had asthma?"
searchString = "Asthma: Ever been told by a doctor or other health professional that you had asthma?";
filteredContent = (dfMARiskFactors[dfMARiskFactors['Selected Risk Factors'].str.contains(searchString)])


### We use numpy for the pre-made calculations
#/* Compute count, max, min of year 2006, for 1 row*/
filteredContent.groupby('Selected Risk Factors').agg({'2006': [np.size, np.max, np.min]})

#/* Compute median, mean, standard deviation of year 2006, for 1 row*/
filteredContent.groupby('Selected Risk Factors').agg({'2006': [np.median, np.mean, np.std]})


############### Option 2
# Only use Pandas, don't use the SQLite database

# Clean up
conn.close()



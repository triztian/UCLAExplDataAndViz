/**
 UCLA Exploratory Data Analysis and Visualization
 Instructor: Ali El-Annan

 Module 2 - Homework 1
 Zoom Stock Prices - Data Manipulation Language (DML)
 Tristian Azuara (tristian.azuara@gmail.com)
 */

/*
 Make sure that you've compiled the extension.
 */
.load ./libsqlitefunctions.dylib

/**
 Import the CSV data, we must defined the separator otherwise
 the import will fail.

 Make sure that the CSV file does not contain header row because it will
 be imported by the command; introducing invalid data.

 Header rows typically look like this:

	#Date,Open,High,Low,Close,Adj Close,Volume

 */
.separator ','
.import ./zm_01-10_04-09.csv zm_data 

/**
 Verify that the data was imported. The count should match the output of the
 `wc` command ie, if we count the number of lines in the CSV files (without the 
 header row) the result of the following count should match, to count the lines
 in the CSV file you can use:

	$ wc zm_01-10_04-09.csv

 */
SELECT COUNT(*) FROM zm_data LIMIT 10;

/**
 Calculate the median, standard deviation and average of the open price, the 
 adjusted closing price and the trading volume respectively.
 */
SELECT 
	MEDIAN(open), 
	STDEV(adjusted_close), 
	AVG(volume) 
FROM zm_data;
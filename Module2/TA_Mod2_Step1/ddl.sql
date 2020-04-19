/**
 UCLA Exploratory Data Analysis and Visualization
 Instructor: Ali El-Anan

 Module 2 - Homework 1
 Zoom Stock Prices - Data Definition Language (DML)
 Tristian Azuara (tristian.azuara@gmail.com)
 */

/* 
CSV Data:
Date,Open,High,Low,Close,Adj Close,Volume
2020-01-10,73.080002,73.800003,72.250000,73.089996,73.089996,1655100
 */
CREATE TABLE zm_data (
	date 			TEXT PRIMARY KEY,
	open 			REAL NOT NULL,
	high 			REAL NOT NULL,
	low				REAL NOT NULL,
	close			REAL NOT NULL,
	adjusted_close	REAL NOT NULL,
	volume			INTEGER NOT NULL
);
#**********************
# JSON, CSV files in R
#**********************

#E1
# import JSON, inspect the data

# load json file from Module 4 (copied over for convenience)
install.packages("rjson")

library("rjson")
json_file <- "/Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module6/LegalSummary.json"
json_data <- fromJSON(file=json_file)

# see what the json looks like
print(json_data)


#E2
# import CSV, inspect the data

# load csv file from Module 1 (copied over for convenience)
csv_file <- read.csv("/Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module6/Sale_Counts_City.csv", header = T)

#see what the csv file looks like
print(csv_file)

#E3
#Use big.table to load csv file and do some basic operation (filter and add a column)
library(xts)
library(data.table)
library(zoo)
library(magrittr)

filePathName <- "/Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module6/Sale_Counts_City.csv"

#Filter out New York and add column
SalesCountyData <- fread(filePathName) %>% 
  .[RegionName == 'New York']  %>% 
  .[,NewColumnToCalculate := (-1)]

#**********************
# GGplot2 and native graphing in R
#**********************

#E4
# http://ggplot2.tidyverse.org/reference/economics.html
# Plot the economics data set data(economics), comes with R
# Plot unemployment rate against dates

# general data science libraries (includes things like lubridate)
install.packages("tidyverse")
install.packages("lazyeval")

#makes working with dates easier
library(lubridate)

#for plotting
library(ggplot2)
data(economics, package = "ggplot2")

brks <- economics$date[seq(1, length(economics$date), 12)]
lbls <- lubridate::year(economics$date[seq(1, length(economics$date), 12)])
unemploymentRate <- economics$unemploy / economics$pop

ggplot(economics, aes(date, unemploymentRate*100)) + 
  geom_area() + 
  scale_x_date(breaks=brks, labels=lbls) + 
  theme(axis.text.x = element_text(angle=90)) + 
  labs(title="Area Chart", 
       subtitle = "Unemployment by Date", 
       y="% Unemployment", 
       caption="Source: Economics R package")

#E5
# Plot the economics data set data(economics), comes with R
# Plot savings rate against dates


#makes working with dates easier
library(lubridate)

#for plotting
library(ggplot2)
data(economics, package = "ggplot2")

brks <- economics$date[seq(1, length(economics$date), 12)]
lbls <- lubridate::year(economics$date[seq(1, length(economics$date), 12)])

ggplot(economics, aes(date, economics$psavert)) + 
  geom_area() + 
  scale_x_date(breaks=brks, labels=lbls) + 
  theme(axis.text.x = element_text(angle=90)) + 
  labs(title="Area Chart", 
       subtitle = "Savings Rate by Date", 
       y="% Savings Rate", 
       caption="Source: Economics R package")
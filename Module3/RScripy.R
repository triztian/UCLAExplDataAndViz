
#Do once
install.packages("dplyr")
install.packages("data.table")

#Other libraries exist, i.e. rmongodb, pick based on stability, features, ease of use, performance
install.packages("mongolite")
install.packages("ggplot2")


library(dplyr)
library(data.table)
library(mongolite)
library(ggplot2)


path <- '/Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module3/'
fileName <- 'Consumer_Complaints.csv'
#no white spaces
pathFileName <- paste(path,fileName,sep="")

# <- versus = ? 
# your perference and use <- is global, = local

cfpbTable=data.table::fread(pathFileName)

#Characterize the data, get a list of the columns
names(cfpbTable)

#Further characterize the data, get the statistics (i.e. counts, length, etc.) of the table
summary(cfpbTable)
str(cfpbTable)
head(cfpbTable, 10)

#### R only
#Let's find the distinct # of Issues
listOfUniqueIssues = unique(cfpbTable$Issue)
countOfUniqueIssues = length(listOfUniqueIssues)

#Let's find the total issues that have 'foreclosure'
#find all Issues that have foreclosures
distinctcfpbTableIssues <- cfpbTable[Issue %like% "foreclosure"]
countOfForeclosures = length(distinctcfpbTableIssues$Issue)
countOfIssues = length(cfpbTable$Issue)

## About 11% of the issues are foreclosures
## 1-((1015280-112314) / 1015280)


### Lets' try with Mongo from R

#Prepare data for MongoDB storage
names(cfpbTable) = gsub(" ","",names(cfpbTable)) 

#Create connection and collection while re-using the previous database
connectionTocfpbTableFromR = mongo(collection = "cfpbTableFromR", db = "cfpb")

#Equivalent of loading the csv/or inserting the data into Mongo
connectionTocfpbTableFromR$insert(cfpbTable)

#Want to run db.collection.findOne() in R, mongoLite library
#https://www.rdocumentation.org/packages/rmongodb/versions/1.8.0/topics/mongo.find
#notice the syntax looks quite different than 'findOne' but the library gives a different API
connectionTocfpbTableFromR$iterate()$one()

#Let's find the distinct # of Issues
distinctcfpbTableIssues <- length(connectionTocfpbTableFromR$distinct("Issue"))

#Let's find the total issues that have 'foreclosure'
#find all Issues that have foreclosures
countOfForeclosures = length((connectionTocfpbTableFromR$find('{ "Issue" : { "$regex" : "foreclosure", "$options" : "i" }  }'))$Issue) # case insensitive
countOfIssues = connectionTocfpbTableFromR$count()


## About 11% of the issues are foreclosures
## 1-((1015280-112314) / 1015280)

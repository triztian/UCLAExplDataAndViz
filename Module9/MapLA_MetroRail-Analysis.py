#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@author: ael-annan
"""


#What is the average distance between the points on a given line?

#Data looks good...
#https://www.metro.net/riding/paid_parking/blue-line/

#But wait...how can this be so outdated (12 stations versus 19 real stations)
#https://www.metro.net/riding/paid_parking/expo-line/
#http://geohub.lacity.org/datasets/6679d1ccc3744a7f87f7855e7ce33395_1?uiTab=table

#We need to first do a GET method to the actual URL or API's result (in this case the Json)
import requests
url = 'http://geohub.lacity.org/datasets/6679d1ccc3744a7f87f7855e7ce33395_1.geojson'
res = requests.get(url)

#We than pull that result, a JSON array into this variable
jsonStore = res.json()

#find the keys, because we only want to focus on the 'package payload'
keys = jsonStore.keys()
listOfJsonStore = jsonStore['features']

#We will than flatten the data from Json into Tabluar format
import pandas
table = pandas.io.json.json_normalize(jsonStore)
anotherTable = pandas.io.json.json_normalize(listOfJsonStore)

#********** explore data
availableColumns = anotherTable.columns
columnsToKeep = ['geometry.coordinates', 'properties.MetroLine', 'properties.OBJECTID', 
                 'properties.Station', 'properties.StopNumber']

#Keep only the following of the data frame
df = anotherTable[columnsToKeep]

# further explore the data, i.e. any nulls,e tc.
df.info()

### Group by line, get only properties.MetroLine column, and count that properties.MetroLine
countOfLines = df.groupby('properties.MetroLine')['properties.MetroLine'].count()

# Group by line, get only properties.MetroLine column and geometry.coordinates
sortedDF = df.sort_values(by=['properties.MetroLine', 'properties.OBJECTID'])

#Multiple ways to do this but ultimately want to 'setup' the data to be able to compute distances
#(option 1)
sortedDFCopy = (df.sort_values(by=['properties.MetroLine', 'properties.OBJECTID'])).copy()
sortedDFCopy['properties.OBJECTID']=sortedDFCopy['properties.OBJECTID']-1

#Use a rolling function (option 2)
#coordinatesAndLines = sortedDF.groupby('properties.MetroLine')['properties.MetroLine', 'geometry.coordinates']
#sortedDF['geometry.coordinates'].rolling(2).apply(distanceBetweenCoordinatesOnSphere)
# ...

# Shift the data frame down... (option 3)

# Merge tables
dfMergedTables = pandas.merge(sortedDF,sortedDFCopy, on=['properties.MetroLine', 'properties.OBJECTID'])

#Define our distance computatin formula
#https://en.wikipedia.org/wiki/Haversine_formula
from math import radians, cos, sin, asin, sqrt, atan2

def distanceBetweenCoordinatesOnSphere(location1, location2, mk='m'):
    
    latitudeOrigin = location1[0] 
    longitudinalOrigin = location1[1]
    latitudeDestination = location2[0]
    longitudinalDestination = location2[1] 

    # decimal degrees to radians 
    lonOrig, latOrig, lonDes, latDes = map(radians, [longitudinalOrigin, latitudeOrigin, longitudinalDestination, latitudeDestination])

    dLon = lonDes - lonOrig 
    dLat = latDes - latOrig 
    
    havLon = sin(dLon/2)**2
    havLat = sin(dLat/2)**2
    a = havLat + (cos(latOrig) * cos(latDes) * havLon)
    
    c = 2 * asin(sqrt(a)) 
    
    # Earth radius (radius of the sphere, in this case, the Earth)
    if (mk == 'm'):
        earthR = 6371 # kilomteres
    else:
        earthR = 3958 # miles

    return c * earthR

#Test our formula
station1 = [-118.19371199400953, 33.77226330234607]
station2 = [-118.19293355079685, 33.76807584865291]

distanceBetweenCoordinatesOnSphere(station1, station2, 'm')

#Check our against an external point
#Google map direction
#https://www.google.com/maps/dir/128+W+1st+St,+Long+Beach,+CA+90802/498+Pacific+Avenue,+Long+Beach,+CA+90802/@33.7704486,-118.1955351,17z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x80dd3139f00db39f:0x463c7608b8dcae6e!2m2!1d-118.1930208!2d33.7679694!1m5!1m1!1s0x80dd3147f9716983:0x974cd2e11e2ebc73!2m2!1d-118.1936594!2d33.7729189!3e0

#Calculate distance across each location
dfMergedTables['distance'] = dfMergedTables.apply(lambda row: distanceBetweenCoordinatesOnSphere(row['geometry.coordinates_x'], row['geometry.coordinates_y']), axis=1)

#Prepare the file for Tableau usage
import os

path = '/Users/ael-annan/Desktop/Storage/MveMveMve/UCLAInstructor/Modules/Module9'
dfMergedTables.to_csv(os.path.join(path,r'tableauOutput.csv'))


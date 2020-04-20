#**********************
# JSON, CSV files in Python
#**********************

#E1
# import JSON, inspect the data
# load json file from Module 4 (copied over for convenience)
import os
import json

json_file = 'LegalSummary.json'
json_file_path = os.path.join(os.getcwd(), json_file)
print(json.loads(json_file_path))

#E2
# import CSV, inspect the data
# load csv file from Module 1 (copied over for convenience)
import csv
csv_file = 'Sale_Counts_City.csv'
with open(os.path.join(os.getcwd(), csv_file), newline='') as csvfile:
    reader = csvfile.reader(csvfile, delimiter=',')
    for row in reader:
        print('|'.join(row)) # simply reprint it

#**********************
# Pandas and native graphing in Python
#**********************

#E3
# Import JSON to pandas
import pandas as pd
pd.read_json(json_file_path)

#E4
#Import HTML to pandas

html_file = ''
pd.read_html() # loads an html table

#E5
# Analyze some of the data
# See the `sale_counts_city.ipynb` notebook

#E6
# Graph some of the data
# See the `sale_counts_city.ipynb`


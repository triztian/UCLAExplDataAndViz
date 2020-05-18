import sys
import os
import csv
import logging

import jinja2
from jinja2 import Template

def main():
	input_file = sys.argv[1]
	input_data = sys.argv[2]

	template_loader = jinja2.FileSystemLoader('./')
	template_env = jinja2.Environment(loader=template_loader)

	template = template_env.get_template('index.src.html')
	page={}
	logging.info(template)

	print(template.render(
		page=page,
		entries=load_data_entries(input_data)
	))


def load_data_entries(csv_path):
	"""Loads the CSV data and converts it into a renderable object"""
	entries = []
	with open(csv_path, newline='') as csvfile:
		csv_entries = csv.reader(csvfile, delimiter=',')
		for entry in csv_entries:
			entries.append({
				'date': entry[0],
				'open': entry[1],
				'high': entry[2],
				'low': entry[3],
				'close': entry[4],
				'adjusted_close': entry[5],
				'volume': entry[6],
			})

	return entries


if __name__ == '__main__':
	main()
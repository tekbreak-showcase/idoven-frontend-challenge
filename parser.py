import csv
import json
import sys
from utils import getFileId, parseFloatValue, maybeParseInt

inputFile = sys.argv[1]

fileId = getFileId(inputFile)

chartSeedPath = '/ecg-data/' + fileId + '.seed'
chartInitialPath = '/app/data/' + fileId + '.init'
chartLengthPath = '/app/data/' + fileId + '.length'

samples = []
secondsSamples = []

with open(inputFile, encoding='utf-8') as handler:
    csv_reader = csv.DictReader(handler)

    for row in csv_reader:
        key = row['Time']
        if row['2'] != '':
            item = {
                't': int(float(row['Time']) * 100), # centisecond unit (10ms) are stored
                '1': parseFloatValue(row['1']),
                '2': parseFloatValue(row['2']),
                '3': parseFloatValue(row['3']),
                '4': parseFloatValue(row['4']),
                'x': 0
            }
            if row['5'] == '0.000000':
                item['x'] = 1
                secondsSamples.append(item)

            line = ','.join(map(str,item.values()))
            samples.append(line)

with open(chartSeedPath, 'w', encoding='utf-8') as handler:
    handler.write('\n'.join(samples))

# Generate and store initial data
seriesList = [[], [], [], []]

for sample in secondsSamples :
    seriesList[0].append(int(sample['1']))
    seriesList[1].append(int(sample['2']))
    seriesList[2].append(int(sample['3']))
    seriesList[3].append(int(sample['4']))

initialData = {
    'interval': 1000,
    'series': seriesList
}

with open(chartInitialPath, 'w', encoding='utf-8') as handler:
    handler.write(json.dumps(initialData, separators=(',', ':')))

# Save length
with open(chartLengthPath, 'w', encoding='utf-8') as handler:
    handler.write(str(len(secondsSamples)))
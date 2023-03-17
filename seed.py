import os
import subprocess
from utils import getFileId

folder = '/ecg-data'
initialFolder = '/app/data'

for root, dirs, files in os.walk('ecg-data'):
    for file in files:
        if file.endswith('.seed'):

            collection = getFileId(file)

            if bool(collection) :
                if os.path.isfile(f"{initialFolder}/${collection}.init"):
                    continue

                command = f"mongoimport --uri mongodb://root:root@mongodb:27017/idoven?authSource=admin \
                  --collection {collection} \
                  --drop \
                  --type csv \
                  --fields='t','1','2','3','4','x' \
                  --file {folder}/{file}"

                result = subprocess.check_output(command, shell=True)
                print(result)

                #os.system(f"rm -rf {folder}/{file}")
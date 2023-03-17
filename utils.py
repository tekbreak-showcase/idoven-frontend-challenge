import re

def getFileId (filename) :
    result = re.search('(\d\d-\d\d-\d\d_data_data)', filename)
    return result[0] if bool(result) else False


def parseFloatValue (value) :
    return float(value) if value != '' else 0

def maybeParseInt (value):
    return int(value) if float(value).is_integer() else value
try:
  typo
except Exception as err:
  print(err)

try:
  a = 4 / 0
except Exception as err:
  print(err)


import json
import urllib.request
import urllib.error
  
# api-endpoint 
URL = "http://erddap.exploratorium.edu:8080/erddap/tabledap/explorebeaconbay5min.csv?time%2CDew_Point&time%3E=2019-05-20T00%3A00%3A00Z&time%3C=2019-05-27T07%3A40%3A00Z"
try:
  response = urllib.request.urlopen(URL) # may throw URLError 
  data = json.loads(response.read().decode("utf-8"))
  table = data['ta1ble'] # may throw KeyError
  a = table['rows'][50] # may throw IndexError
except urllib.error.URLError as e:
    print(('GET request error. Reason: {}')
      .format(e.reason))
except (KeyError, IndexError):
    print('JSON structure is not as expected')
except Exception as e:
  print('Exception of type {} has occured.'.format(type(e)))
  
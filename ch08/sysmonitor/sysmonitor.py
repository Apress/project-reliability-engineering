import csv
from datetime import datetime
import os.path
import psutil
import yaml

def to_csv_line(arr):
  return (',').join(str(x) for x in arr) + '\n'

with open('sysmonitor.yaml', 'r') as f:
  config = yaml.load(f)
  metrics = config['metrics']

headers = ['time']
stats = [datetime.now().isoformat()]

for m in metrics:
  if m['name'] == 'cpu':
    data = psutil.cpu_percent(interval=1)
  elif m['name'] == 'mem':
    data = psutil.virtual_memory().percent 
  elif m['name'] == 'hdd':
    data = psutil.disk_usage('/').percent

  if data > m['threshold']:
    # trigger alert
    print('trigger alert for {}'.format(m['name']))

  headers.append(m['name'])
  stats.append(data)
    
if os.path.exists('sysmetrics.log'):
  with open('sysmetrics.log', 'a') as f:
    writer = csv.writer(f)
    writer.writerow(stats)
else:
  with open('sysmetrics.log', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerow(stats)
    
    



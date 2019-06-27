from datetime import datetime, timedelta
import sys

import yaml

TIME_FORMAT = '%Y-%m-%d %H:%M:%S'

def send_alert(alert):
  print(alert['message'])

with open('config.yaml', 'r') as f:
  config = yaml.load(f)
alerts = config['alerts']
for alert in alerts:
  alert['count'] = 0
start_time = datetime.now() - timedelta(minutes=config['time'])

for line in sys.stdin:
  logtime_substring = line[1:20]
  logtime = datetime.strptime(logtime_substring, TIME_FORMAT)
  print(logtime, logtime_substring)
  if (logtime < start_time):
    print("too far back")
    continue
  for alert in alerts:
    if (line.find(alert['text']) > -1):
      alert['count'] += 1

for alert in alerts:
  if alert['count'] >= alert['thrshold']:
    send_alert(alert)



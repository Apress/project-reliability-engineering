import os
from datetime import datetime

TIME_FILE = '/tmp/lastalert'
MIN_ALERT_TIME = 10 # minutes

def send_alert(msg):
  print(msg)

def trigger_throttled_alert(msg):
  try:
    last_time = os.path.getctime(TIME_FILE)
    last_time = datetime.fromtimestamp(last_time)
    now = datetime.now()
    diff_minutes = (now - last_time).seconds / 60
  except:
    diff_minutes = MIN_ALERT_TIME + 1

  if (diff_minutes) > MIN_ALERT_TIME:
    with open(TIME_FILE, 'w'):
      pass
    send_alert(msg)
  
trigger_throttled_alert("sending an alert")
import sys

import yaml

with open('config.yaml', 'r') as f:
  config = yaml.load(f)
for alert in config['alerts']:
  print(alert)

for line in sys.stdin:
  sys.stdout.write(line)
  if (print(line.find('ERROR'))

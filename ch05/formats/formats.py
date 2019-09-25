import yaml

with open('config.yaml', 'r') as f:
  config = yaml.full_load(f)
for fan in config['fans']:
  print('{} uses pin {}'
    .format(fan['name'], fan['pin']))




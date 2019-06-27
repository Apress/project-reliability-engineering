from config import cfg
for fan_cfg in cfg['fans']:
  print('{} uses gpio {}').format(
    fan_cfg['name'], fan_cfg['gpio'])

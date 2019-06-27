import argparse
import yaml

parser = argparse.ArgumentParser(description="Weather station project")
parser.add_argument('--interval',
                    type=int, 
                    help='set measuring loop interval', 
                    metavar='time_sec')
parser.add_argument('--fan-pin', 
                    nargs=2, 
                    type=int, 
                    action="append", 
                    help='override fan GPIO pin number', 
                    metavar=('idx', 'pin'))

parser.add_argument('--conf-file', 
                    nargs=1, 
                    type=str,
                    default=['config.yaml'], 
                    help='set configuration
                     file',
                    metavar='filename')
parser.add_argument('-v', '--verbose', help='verbose',
  action="store_true", default=False)
args = parser.parse_args()
print(args)

class Fan():
  def __init__(self, conf):
    self.name = conf['name']
    self.pin = conf['pin']
  def announce(self):
    print('fan {} uses pin {}'.format(self.name, self.pin))


print('configuration file: {}'.format(args.conf_file[0]))
with open(args.conf_file[0], 'r') as f:
  config = yaml.load(f)

if args.fan_pin:
  for fan_option in args.fan_pin:
    fan_index = fan_option[0]
    new_fan_pin = fan_option[1]
    config['fans'][fan_index]['pin'] = new_fan_pin

fan_list = (Fan(fan_config) for fan_config in config['fans'])

for fan in fan_list:
  fan.announce()

print('Verbose mode: {}'.format(args.verbose))


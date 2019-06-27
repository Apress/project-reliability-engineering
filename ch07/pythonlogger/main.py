import argparse
import yaml
import logging
import fans
import time
import sys

parser = argparse.ArgumentParser()
parser.add_argument('-v', dest='verbose',nargs='?', const='DEBUG')

args = parser.parse_args()

with open("config.yaml", 'r') as stream:
    config = yaml.load(stream, Loader=yaml.Loader)

test_logger = logging.getLogger('test')
#file_handler = logging.handlers.WatchedFileHandler(config['logging']['file'])
rot_handler = logging.handlers.RotatingFileHandler(
  'logs/out.log', backupCount=7, maxBytes=100)
#test_logger.addHandler(file_handler)
test_logger.addHandler(rot_handler)

# Mail Handler
mailhost = ('smtp.gmail.com', 587)
fromaddr = 'erddap-reports@exploratorium.edu'
toaddrs = 'eyal.person.shahar@gmail.com'
subject = 'alert!'
credentials = ('erddap-reports@exploratorium.edu', 'wiredpier')

mail_handler = logging.handlers.SMTPHandler(
  mailhost, 
  fromaddr, 
  toaddrs, 
  subject, 
  credentials=credentials, 
  secure=(), 
  timeout=1.0
  )

test_logger.addHandler(mail_handler)


print(args)
if args.verbose:
  config['logging']['level'] = args.verbose
  verbose_handler = logging.StreamHandler(sys.stdout)
  test_logger.addHandler(verbose_handler)

test_logger.setLevel(config['logging']['level'])


test_logger.debug('Debug message')
test_logger.info('Info message')
test_logger.warning('Warning message')  
test_logger.error('Error message')





FORMAT='[{asctime}.{msecs:0>3.0f}] {levelname}: {message} ({filename}:{funcName}:{lineno})'
DATEFMT = '%Y-%m-%d %H:%M:%S'
logging.basicConfig(
  filename='/var/log/weather/app.log',
  filemode='w',
  level=logging.INFO,
  style='{',
  format=FORMAT,
  datefmt=DATEFMT
  )

#format='[%(asctime)s] %(name)s: %(levelname)-8s %(message)s (in %(funcName)s)'
fans = fans.Fans()

def log_from_app():
  for i in range(1):
    logging.debug('Debug message')
    logging.info('Info message')
    logging.warning('Warning message')  
    logging.error('Error message')  
    fans.test()


fans.test()

while True:
  log_from_app()
  time.sleep(5)



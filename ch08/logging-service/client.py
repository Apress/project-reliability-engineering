import loglib
import time

logger = loglib.getLogger()
#logger = loglib.logger()

while True:
  logger.info('hey')
  time.sleep(1)
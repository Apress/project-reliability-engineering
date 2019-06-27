import json
import socket
import logging
from io import StringIO

FORMAT='{message} (at {filename}:{lineno})'
DEFAULT_ADDRESS=('127.0.0.1', 3003)

class CostumHandler(logging.StreamHandler):
  def __init__(self, server_address=DEFAULT_ADDRESS):
    super(CostumHandler, self).__init__()
    self.server = server_address
    self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

  def emit(self, record):
    msg = {
      'text': self.format(record),
      'levelno': record.levelno
    }
    print(msg)
    self.socket.sendto(json.dumps(msg).encode('utf-8'), self.server)
 
def getLogger():
  logger = logging.getLogger('service')
  handler = CostumHandler()
  formatter = logging.Formatter(FORMAT, style='{')
  handler.setFormatter(formatter)
  logger.addHandler(handler)
  logger.setLevel(logging.DEBUG)
  return logger



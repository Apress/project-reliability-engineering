import socket
import logging
import json

UDP_IP_ADDRESS = "0.0.0.0"
UDP_PORT_NO = 3003

FORMAT='[{asctime}] {levelname}: {message}'

socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socket.bind((UDP_IP_ADDRESS, UDP_PORT_NO))

logger = logging.getLogger('project-logger')
handler = logging.FileHandler('out.log')
logger.addHandler(handler)
formatter = logging.Formatter(FORMAT, style='{')
handler.setFormatter(formatter)
logger.setLevel(logging.DEBUG)

while True:
   data, client_addr = socket.recvfrom(4096)
   msg = json.loads(data.decode('utf-8'))
   logger.log(msg['levelno'], msg['text'])
   
import threading
import time
import smbus
import json
from flask import Flask, render_template

app = Flask(__name__)

class Sensor():
  def __init__(self):
    pass

class Si7021Temp(Sensor):
  def __init__(self, name, bus_id):
    self.name = name
    self.units = "Celsius"
    self.bus = smbus.SMBus(bus_id)
    
  def measure(self):
    self.bus.write_byte(0x40, 0xF3)
    time.sleep(0.3)
    byte0 = self.bus.read_byte(0x40)
    byte1 = self.bus.read_byte(0x40)
    self.measurement = ((byte0 * 256 + byte1 ) * 175.72 / 65536.0) - 46.85
    time.sleep(0.3)


class MPL3115A2Pressure(Sensor):
  def __init__(self, name, bus_id):
    self.name = name
    self.units = "kPa"
    self.bus = smbus.SMBus(bus_id)
  
  def measure(self):
    self.bus.write_byte_data(0x60, 0x26, 0xB9)
    self.bus.write_byte_data(0x60, 0x13, 0x07)
    self.bus.write_byte_data(0x60, 0x26, 0xB9)
    time.sleep(1)
    data = self.bus.read_i2c_block_data(0x60, 0x00, 4)
    self.measurement = ((data[1] * 65536) + (data[2] * 256) + (data[3] & 0xF0)) / 16

class MPL3115A2Temp(Sensor):
  def __init__(self, name, bus_id):
    self.name = name
    self.units = "C"
    self.bus = smbus.SMBus(bus_id)
  
  def measure(self):
    self.bus.write_byte_data(0x60, 0x26, 0xB9)
    self.bus.write_byte_data(0x60, 0x13, 0x07)
    self.bus.write_byte_data(0x60, 0x26, 0xB9)
    time.sleep(1)
    data = self.bus.read_i2c_block_data(0x60, 0x00, 6)
    self.measurement = ((data[4] * 256) + (data[5] & 0xF0)) / 16 / 16
    
sensors_list = []
sensors_list.append(Si7021Temp("temp", 1))
sensors_list.append(Si7021Temp("temp_2", 1))

  
def measuring_loop():
  global ws_event_loop
  while True:
    for sensor in sensor_list:
      sensor.measure()
      msg = json.dumps(
        {'sensors' : [sensor]}, 
        cls=SensorEncoder)
      asyncio.run_coroutine_threadsafe(
        send_to_all(msg), loop=ws_event_loop)
    time.sleep(5)


@app.route("/dashboard/")
def dashboard():
    return render_template("ws.html")

import websockets
import asyncio

client_set = set()

class SensorEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Sensor):
      return {
        "name": obj.name,
        "measurement": obj.measurement,
        "units": obj.units
      }
    return json.JSONEncoder.default(self, obj)

def websocket_thread():
  global ws_event_loop
  ws_event_loop = asyncio.new_event_loop()
  asyncio.set_event_loop(ws_event_loop)
  ws_server = websockets.serve(
    client_handler, host='0.0.0.0', port=3001)
  ws_event_loop.run_until_complete(ws_server)
  ws_event_loop.run_forever()


async def client_handler(client, data_handler):
  client_set.add(client)
  await client.send(
    json.dumps({"sensors": sensors_list}, 
    cls=SensorEncoder))
  try:
    while True:
      message = await client.recv()
      if data_handler:
        data_handler(json.loads(message))
  finally:
    client_set.remove(client)

async def send_to_all(msg):
  if client_set:
    await asyncio.wait(
      [user.send(msg) for user in client_set])

if __name__ == '__main__':
  measuring_thread = threading.Thread(target=measuring_loop)
  measuring_thread.start()
  ws_thread = threading.Thread(target=websocket_thread)
  ws_thread.start()
  app.run(host = '0.0.0.0')
    
  


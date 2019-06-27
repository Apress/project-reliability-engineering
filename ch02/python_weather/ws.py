import threading
import time
import smbus
from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

is_measuring = True

class Sensor:
  def __init__(self):
    self.measurement = -999

  def get_read_as_string(self):
    return('{} {}'.format(self.measurement, self.units))

class Si7021Temp(Sensor):
  def __init__(self, name, bus_id):
    super().__init__()
    self.name = name
    self.units = 'Celsius'
    self.bus = smbus.SMBus(bus_id)
    
  def measure(self):
    self.bus.write_byte(0x40, 0xF3)
    time.sleep(0.1)
    byte0 = self.bus.read_byte(0x40)
    byte1 = self.bus.read_byte(0x40)
    self.measurement = ((byte0 * 256 + byte1) 
      * 175.72 / 65536.0) - 46.85
    time.sleep(0.1)

class Si7021Humidity(Sensor):
  def __init__(self, name, bus_id):
    super().__init__()
    self.name = name
    self.units = '%'
    self.bus = smbus.SMBus(bus_id)
    
  def measure(self):
    self.bus.write_byte(0x40, 0xF5)

    time.sleep(0.1)
    byte0 = self.bus.read_byte(0x40)
    byte1 = self.bus.read_byte(0x40)
    self.measurement = ((byte0 * 256 + byte1)
      * 125 / 65536.0) - 6
    time.sleep(0.1)


class MPL3115A2Pressure(Sensor):
  def __init__(self, name, bus_id):
    super().__init__()
    self.name = name
    self.units = 'kPa'
    self.bus = smbus.SMBus(bus_id)
  
  def measure(self):
    self.bus.write_byte_data(0x60, 0x26, 0x39)
    time.sleep(0.1)
    data = self.bus.read_i2c_block_data(
      0x60, 0x00, 4)
    self.measurement = (
      (data[1] * 65536) + (data[2] * 256)
      + (data[3] & 0xF0)) / 64000

sensor_list = []
sensor_list.append(Si7021Temp('temp', 1))
sensor_list.append(Si7021Humidity('humidity', 1))
sensor_list.append(MPL3115A2Pressure('air_pressure', 1))


def measuring_loop():
  while True:
    print(is_measuring)
    if is_measuring:
      for sensor in sensor_list:
        sensor.measure()
    time.sleep(1)

t = threading.Thread(target=measuring_loop)
t.start()


@app.route('/dashboard/')
def show_dashboard():
  return render_template(
    'dashboard.html', 
    sensor_list=sensor_list,
    is_measuring=is_measuring)

@app.route("/control")
def control():
  global is_measuring
  print('requeting loop', request.args.get('loop'))
  is_measuring = (request.args.get('loop') == 'true')
  res = {"is_measuring": is_measuring}
  return jsonify(res)

if __name__ == '__main__':
    app.run(host = '0.0.0.0')

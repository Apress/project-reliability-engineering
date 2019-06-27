import time
import smbus
import flask

class Si7021Temp:
  def __init__(self, name, bus_id):
    self.name = name
    self.units = 'Celsius'
    self.bus = smbus.SMBus(bus_id)
    
  def measure(self):
    self.bus.write_byte(0x40, 0xF3)
    time.sleep(0.1)
    byte0 = self.bus.read_byte(0x40)
    byte1 = self.bus.read_byte(0x40)
    self.measurement = (
      (byte0 * 256 + byte1) * 
        175.72 / 65536.0) - 46.85
    time.sleep(0.1)

class Si7021Humidity:
  def __init__(self, name, bus_id):
    self.name = name
    self.units = "%"
    self.bus = smbus.SMBus(bus_id)
    
  def measure(self):
    self.bus.write_byte(0x40, 0xF5)

    time.sleep(0.1)
    byte0 = self.bus.read_byte(0x40)
    byte1 = self.bus.read_byte(0x40)
    self.measurement = ((byte0 * 256 + byte1) * 
    125 / 65536.0) - 6
    time.sleep(0.1)


class MPL3115A2Pressure:
  def __init__(self, name, bus_id):
    self.name = name
    self.units = 'kPa'
    self.bus = smbus.SMBus(bus_id)
  
  def measure(self):
    self.bus.write_byte_data(0x60, 0x26, 0x39)
    time.sleep(0.1)
    data = self.bus.read_i2c_block_data(
      0x60, 0x00, 4)
    self.measurement = (
      (data[1] * 65536) + (data[2] * 256) + 
        (data[3] & 0xF0)) / 64000

sensors_list = []
sensors_list.append(Si7021Temp('temp', 1))
sensors_list.append(Si7021Humidity('humidity', 1))
sensors_list.append(
  MPL3115A2Pressure('air_pressure', 1))

def measuring_loop():
  while True:
    for sensor in sensors_list:
      sensor.measure()
      print('{} measured {:.2f} {}'.format(
        sensor.name, 
        sensor.measurement, 
        sensor.units))
    time.sleep(5)

measuring_loop()

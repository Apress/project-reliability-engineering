var express = require('express')
const i2c = require("i2c-bus");

var app = express();
var sensorList = [];
var isMeasuring = true;

app.use(express.static('public'))
app.get('/status', (request, response) => {
  response.json({
    sensors: sensorList,
    measuring: isMeasuring
  });	
});
  
app.listen(3000, function () {
  console.log('ready!')
});

class Sensor {
  constructor(name) {
    this.name = name;
    this.measurement = -999;
  }
  
  getReadAsString() {
    if ('units' in this) { 
      return(`${this.measurement} ${this.units}`);
    } else {
      return(String(this.measurement));
    }
  }
}

class Si7021Temp extends Sensor {
  constructor(name, busId) {
    super(name);
    this.units = 'Celcius';
    this.busId = busId;
    this.i2cBus = i2c.openSync(busId);
  }

  measure() {
    this.i2cBus.writeByte(0x40, 0xF3, 0, (err) => {      
      if(err) {
        console.log(err);
        this.measurement = -999;
        return;
      }
      setTimeout(() => {
        this.i2cBus.i2cRead(
          0x40,
          3,
          new Buffer(3),
          (err, bytesRead, data) => {
          if(err) {
            console.log(err);
            this.measurement = -999;
            return;
          }
          this.measurement = (
            ((((data[0] << 8) |
              data[1]) * 175.72) / 65536) - 46.85);
          console.log(this.measurement);
        });
      }, 100);
    });
  }
}

sensorList.push(new Si7021Temp('test_sensor', 1));
// ... we have to wait until we can read it!

setInterval(() => {
  if (isMeasuring) {
    for (let s of sensorList) {
      s.measure();
    }
  } else {
    console.log('not measureing');
  }
}, 1000);




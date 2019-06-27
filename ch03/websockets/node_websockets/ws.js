var express = require('express')
const i2c = require("i2c-bus");
const WebSocket = require('ws');

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

 
const wsServer = new WebSocket.Server({
  port: 3001
});

wsServer.broadcast = function(data) {
  for (client of wsServer.clients) {
    client.send(data);
  }
};

wsServer.on('connection', function (socket) {
  wsServer.broadcast(JSON.stringify({
    sensors: sensorList
  }));
  socket.on('message', function (data) {
    // handle incoming data here
  });
}); 

class Sensor {
  constructor(name) {
    this.name = name;
    this.measurement = -999;
  }

  toJSON() {
    return {
      name: this.name,
      measurement: this.measurement,
      units: this.units
    };
  }

  
  getReadAsString() {
    if ('units' in this) { 
      return(`${this.measurement} ${this.units}`);
    } else {
      return String(this.measurement);
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
        });
      }, 100);
    });
  }
}

sensorList.push(new Si7021Temp('test_sensor', 1));
// ... we have to wait until we can read it!

setInterval(() => {
  if (isMeasuring) {
    for (sensor of sensorList) {
      sensor.measure()
      wsServer.broadcast(
        JSON.stringify({sensors: [sensor]}));
    }
  } else {
    console.log('not measureing');
  }
}, 1000);




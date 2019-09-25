var express = require('express')
var app = express();
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);

app.set('view engine', 'pug');
app.use(express.static('static'))
app.get('/dashboard', (request, response) => {
  response.render(
    'dashboard', { sensors: sensorList, fans: fanList });
});

app.get('/gauges', (request, response) => {
  response.render(
    'gauges', { sensors: sensorList, fans: fanList });
});
  
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

const i2c = require("i2c-bus");

class Sensor {
  constructor(name) {
    this.name = name;
    this.measurement = -999;
  }

  toJSON() {
    return {
      name: this.name,
      measurement: this.measurement,
      units: this.units,
      time: this.time
    };
  }
  
  getReadAsString() {
    if (this.hasOwnProperty("units")) { 
      return(this.measurement + ' ' + this.units);
    } else {
      return(String(this.measurement));
    }
  }
}

class Si7021Temp extends Sensor {
  constructor(name, busId) {
    super(name);
    this.units = "deg C";
    this.busId = busId;
    this.i2cBus = i2c.openSync(busId);
  }

  read() {
    this.i2cBus.writeByte(0x40, 0xF3, 0, (err) => {
      if(err) {
        console.log(err);
        this.measurement = -999;
        return;
      }
      setTimeout(() => {
        this.i2cBus.i2cRead(0x40, 3, new Buffer(3),
  (err, bytesRead, data) => {
          if(err) {
            this.measurement = -999;
            return;
          }
          this.measurement = (((((data[0] << 8) | data[1]) * 175.72) / 65536) - 46.85);
          this.time = new Date();
        });
      }, 30);
    });
  }
}

class MPL3115A2Temp extends Sensor {
  constructor(name, busId) {
    super(name);
    this.units = "deg C";
    this.busId = busId;
    this.i2cBus = i2c.openSync(busId);
  }

  read() {
    this.i2cBus.writeByteSync(0x60, 0x26, 0xB9);
    this.i2cBus.writeByteSync(0x60, 0x13, 0x07);
    this.i2cBus.writeByte(0x60, 0x26, 0xB9, (err) => {
      setTimeout(() => {
        let data = new Buffer(6);
        this.i2cBus.i2cReadSync(0x60, 6, data);
        let temp = ((data[4] * 256) + (data[5] & 0xF0)) / 16;
        this.measurement = (temp / 16.0);
        this.time = new Date();
      }, 1000);
    })
  }
}

class Fan {
  constructor(name, pin) {
    this.name = name;
    this.pin =  pin;
    gpio.setup(this.pin, gpio.DIR_OUT);
  }

  set(state) {
    this.state = state;
    gpio.write(this.pin, this.state);
    wsServer.broadcast(JSON.stringify({
      fans: [this]
    }));
  } 
}

const WebSocket = require('ws');
const wsServer = new WebSocket.Server({
  port: 3001,
});

wsServer.broadcast = function(data) {
  for (client of wsServer.clients) {
    client.send(data);
  }
};
 
wsServer.on('connection', function connection(ws) {
  wsServer.broadcast(JSON.stringify({sensors: sensorList}));
  ws.on('message', function incoming(data) {
    //
  });
});


  var sensorList = [];
  var fanList = [];
  var threshold  = 24;
  sensorList.push(new Si7021Temp("Si7021Temp", 1));
  sensorList.push(new MPL3115A2Temp("MPL3115A2Temp", 1));
  fanList.push(new Fan("left", 20));
  fanList.push(new Fan("right", 21));

  setInterval(() => {
    fanList[0].set(sensorList[0].measurement > threshold);
    fanList[1].set(sensorList[1].measurement > threshold);
  }, 1000);

setInterval(() => {
  for (s of sensorList) {
    s.read()  
    wsServer.broadcast(JSON.stringify({
      sensors: [s]
    }));
  } 
}, 1000);


var express = require('express')
var app = express();
var gpio = require('rpi-gpio');
gpio.setMode(gpio.MODE_BCM);


app.set('view engine', 'pug');
app.use(express.static('public'))
app.get('/', (request, response) => {
	response.render(
		'dashboard', { sensors: sensorList, fans: fanList });
	});
	
	app.listen(3000, function () {
		console.log('Example app listening on port 3000!')
	});
	
	const i2c = require("i2c-bus");
	
	class Sensor {
		constructor(name) {
			this.name = name;
			this.lastRead = -999;
		}
		
		toJSON() {
			return {
				name: this.name,
				lastRead: this.lastRead,
				units: this.units,
				time: this.time
			};
		}
		
		getReadAsString() {
			if (this.hasOwnProperty("units")) { 
				return(this.lastRead + ' ' + this.units);
			} else {
				return(String(this.lastRead));
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
					this.lastRead = -999;
					return;
				}
				setTimeout(() => {
					this.i2cBus.i2cRead(
						0x40, 3, new Buffer(3),
						(err, bytesRead, data) => {
							if(err) {
								this.lastRead = -999;
								return;
							}
							this.lastRead = (((((data[0] << 8) | data[1]) * 175.72) / 65536) - 46.85);
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
						this.lastRead = (temp / 16.0);
						this.time = new Date();
					}, 1000);
				})
			}
		}
		
		class Fan {
			constructor(name, pinNumber) {
				this.name = name;
				this.pinNumber =  pinNumber;
				gpio.setup(this.pinNumber, gpio.DIR_OUT);
			}
			
			set(b) {
				this.state = b;
				gpio.write(this.pinNumber, this.state);
				wss.broadcast(JSON.stringify({
					fans: [this]
				}));
			} 
		}
		
		const WebSocket = require('ws');
		
		const wss = new WebSocket.Server({
			port: 3001,
		});
		
		wss.broadcast = function(data) {
			for (client of wss.clients) {
				client.send(data);
			}
		};
		
		wss.on('connection', function connection(ws) {
			wss.broadcast(JSON.stringify({sensors: sensorList}));
			ws.on('message', function incoming(data) {
				//
			});
		});
		
		
		var sensorList = [];
		var fanList = [];
		var threshold  = 22.225;
		sensorList.push(new Si7021Temp("Si7021Temp", 1));
		sensorList.push(new MPL3115A2Temp("MPL3115A2Temp", 1));
		fanList.push(new Fan("left", 20));
		fanList.push(new Fan("right", 21));
		
		setInterval(() => {
			fanList[0].set(sensorList[0].lastRead > threshold);
			fanList[1].set(sensorList[1].lastRead > threshold);
		}, 1000);
		
		setInterval(() => {
			for (s of sensorList) {
				s.read()  
				wss.broadcast(JSON.stringify({
					sensors: [s]
				}));
			} 
		}, 1000);
		
		
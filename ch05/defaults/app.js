const fs = require('fs');
var config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

var defaults = {
  position: {
    x: 5,
    y: 6
  },
  admin: 'me'
} 

class sesnorType1 {
  constructor({name, type, category='temperatue'}) {
    this.name = name;
    this.category = category;
    console.log('type 1 created');
    console.log(this.name, this.category);
  }
}

class sesnorType2 {
  constructor(config) {
    Object.assign(this, defaults, config);
    console.log('type 2 created');
    console.log(this);
    console.log(this.position);
  }
}

for (let sensorConfig of config.sensors) {
  
  let newSensor;
  switch (sensorConfig.type) {
    case 'type1': 
      newSensor = new sesnorType1(sensorConfig);
      break;
      case 'type2': 
      newSensor = new sesnorType2(sensorConfig);
      break;
  }
}


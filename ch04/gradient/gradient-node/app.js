console.log("app started")

var express = require('express')
var app = express();
console.log("experess started")

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/tty.usbmodem141131', {
  baudRate: 56700   
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

port.on('error', function(err) {
  console.log('ERROR: ', err.message)
});

console.log("serial started")

app.use(express.static('public'))
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

app.get('/strip', (req, res) => {
  res.send(JSON.stringify({colors: colorArray}));
})

let colorArray = [];

//const parser = new Readline()
//port.pipe(parser)

//parser.on('data', line => {
//  console.log(line.charCodeAt(0));
//  colorArray[line.charCodeAt(0) - 128] = '#' + line.slice(1).padStart(7,'0');
//})

//let inBuffer = Buffer.alloc(7);
//let bufIndex = 999;

/*port.on('data', data => {
  console.log("data in");
  for (b of data) {
    if (b > 127) {
      bufIndex = 0;
    }
    inBuffer[bufIndex++] = b; 
    if (bufIndex == 7) {
      colorArray[inBuffer[0] - 128] = '#' + inBuffer.slice(1).toString();
    }
  }
  
});
*/
//let buf = Buffer.alloc(7);


/*function setLed(n, channelArray) {

  let i = 0;
  buf[i++]= (n + 128);
  for (let channel of channelArray) {
    buf[i++] = channel >> 7;
    buf[i++] = channel & 127;
  }
  port.write(buf);
  //console.log(buf);
}
*/
/*
let colorList = [
  [0, 255, 0],
  [0, 0, 255],
  [255, 0, 0]
];

let colorListIndex = 0;
let ledIndex = 0;

*/
/*setInterval(() => {
  setLed(++ledIndex, colorList[colorListIndex]);
  if (ledIndex == 127) {
    ledIndex = 0;
    colorListIndex = (++colorListIndex) % colorList.length;
  }
}, 5);

function Wheel(wheelPos) {
  wheelPos = 255 - wheelPos;
  if(wheelPos < 85) {
    return [255 - wheelPos * 3, 0, wheelPos * 3];
  }
  if(wheelPos < 170) {
    WheelPos -= 85;
    return [0, wheelPos * 3, 255 - wheelPos * 3];
  }
  wheelPos -= 170;
  return [wheelPos * 3, 255 - wheelPos * 3, 0];
}*/

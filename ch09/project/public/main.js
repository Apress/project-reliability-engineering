var ws = new WebSocket(
  `ws://${location.hostname}:3001`
);
ws.onmessage = function (event) {
  data = JSON.parse(event.data);
  updateDashboard(data);
};

function updateDashboard(data) {
  for (key in data) {	 
    switch(key) {
      case "sensors": 
        for (let sensor of data.sensors) {
          let sensorElement = 
            document.getElementById(sensor.name);
          sensorElement
            .getElementsByClassName(
            "time")[0].innerHTML 
            = new Date(sensor.time).toLocaleTimeString();
          sensorElement
            .getElementsByClassName(
            "last-read")[0].innerHTML 
            = sensor.lastRead.toFixed(3); 
        }
        break;
      case "fans":
        for (let fan of data.fans) {
          let fanElement = 
            document.getElementById(fan.name);
          if ("state" in fan) {
            if (fan.state){
              fanElement.classList.add("on");
              fanElement.classList.remove("off");
            } else {
              fanElement.classList.add("off");
              fanElement.classList.remove("on");
            }
         }
       }          
    }
  }  
}

function setFakeTemp(element) {
  ws.send(JSON.stringify({
    fake: {
      sensor: element.name,
      value: parseInt(element.value)
    }
  }));
}





var ws = new WebSocket(
  `ws://${location.hostname}:3001`
);
ws.onmessage = function (event) {
  let data = JSON.parse(event.data);
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
            "measurement")[0].innerHTML 
            = sensor.measurement.toFixed(3); 
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


var ws = new WebSocket(
  `ws://${location.hostname}:3001`
);
ws.onmessage = function (event) {
  let data = JSON.parse(event.data);
  updateDashboard(data);
};

var gaugeChartDict = {};

google.charts.load('current',
  {'packages':['gauge']});
google.charts.setOnLoadCallback(drawGauges);

function drawGauges () {
  let gaugeContainerList = 
    document
     .getElementsByClassName('gauge-container');
  for (let gaugeContainer of gaugeContainerList) {
    let chart = 
      new google.visualization.Gauge(gaugeContainer);
    let options = {
      min: gaugeContainer.dataset.min,
      max: gaugeContainer.dataset.max,
      width: 200, 
      height: 200
    };
    let data = 
      google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        [gaugeContainer.dataset.label, 0]
      ]);
    gaugeChartDict[gaugeContainer.dataset.label] = {
      chart: chart,
      options: options,
      data: data
    };
    chart.draw(data, options);
  }
}

function updateDashboard(data) {
  for (key in data) {	 
    switch(key) {
      case "sensors": 
        for (let sensor of data.sensors) {
          updateGauge(sensor.name, sensor.measurement);
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
        break;
    }
  }
}

function updateGauge(gaugeId, value) {
  let gauge = gaugeChartDict[gaugeId];
  if (gauge) {
    gauge.data.setValue(0, 1, value);
    gauge.chart.draw(gauge.data, gauge.options);
  }
}
function fetchExample() {
  const fetch = require('node-fetch');
  fetch('http://erddap.exploratorium.edu:8080/erddap/tabledap/allDatasets.json?datasetID%2Caccessible%2Cinstitution%2CdataStructure%2Ccdm_data_type%2Cclass%2Ctitle%2CminLongitude%2CmaxLongitude%2ClongitudeSpacing%2CminLatitude%2CmaxLatitude%2ClatitudeSpacing%2CminAltitude%2CmaxAltitude%2CminTime%2CmaxTime%2CtimeSpacing%2Cgriddap%2Csubset%2Ctabledap%2CMakeAGraph%2Csos%2Cwcs%2Cwms%2Cfiles%2Cfgdc%2Ciso19115%2Cmetadata%2CsourceUrl%2CinfoUrl%2Crss%2Cemail%2Csummary')
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data.table.columnNames);
      //isMeasuring = JSON.parse(data);
      
    }).catch(function(err) {
      console.error(err);
    });
}
/*b = null;
b.do(); 
*/



function simpleTryCatch() {
  const fs = require('fs');
  try {
    console.log(a[2])
  } catch (error) {
    console.log('error', error)
  }

  b = null;
  try {
    b.do(); 
  } catch (error) {
    console.log('error', error) 
    // recover
  }
}

function typeExample() {
  try {
    v1[
  } catch () {

  }

}

function httpExample() {
  const https = require('https');
  //https.get('https://a1pi.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
  https.get(3, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data).explanation);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

fetchExample();
setInterval(() => {
  console.log('tick')
}, 1000);


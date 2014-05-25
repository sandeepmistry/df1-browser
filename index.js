// graphing based off: https://gist.github.com/mbostock/1642874

var async = require('async');

var d3 = require('d3');

var DeviceFactory1 = require('device-factory1');

document.addEventListener('DOMContentLoaded', function() {
  var n = 40;
  var dataX = d3.range(n);
  var dataY = d3.range(n);
  var dataZ = d3.range(n);

  var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 40
  };
  
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
 
  var x = d3.scale.linear().domain([0, n - 1]).range([0, width]);
   
  var y = d3.scale.linear().domain([-2, 2]).range([height, 0]);
 
  var line = d3.svg.line().x(function(d, i) {
    return x(i);
  }).y(function(d, i) {
    return y(d);
  });
 
  var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
  svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
 
  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y(0) + ")").call(d3.svg.axis().scale(x).orient("bottom"));
 
  svg.append("g").attr("class", "y axis").call(d3.svg.axis().scale(y).orient("left"));
 
  var pathX = svg.append("g").attr("clip-path", "url(#clip)").append("path").datum(dataX).attr("class", "lineX").attr("d", line);
  var pathY = svg.append("g").attr("clip-path", "url(#clip)").append("path").datum(dataY).attr("class", "lineY").attr("d", line);
  var pathZ = svg.append("g").attr("clip-path", "url(#clip)").append("path").datum(dataZ).attr("class", "lineZ").attr("d", line);

  DeviceFactory1.discover(function(df1) {
    console.log('found ' + df1.uuid);

    df1.on('disconnect', function() {
      console.log('disconnected!');
      //process.exit(0);
    });

    df1.on('accelerometerChange', function(ax, ay, az) {
      console.log('accelerometerChange: x = %s, y = %s, z = %s', ax.toFixed(1), ay.toFixed(1), az.toFixed(1));

      dataX.push(ax);
      dataY.push(ay);
      dataZ.push(az);
     
      // redraw the line, and slide it to the left
      pathX.attr("d", line).attr("transform", null).transition().duration(100).ease("linear").attr("transform", "translate(" + x(-1) + ",0)");
      pathY.attr("d", line).attr("transform", null).transition().duration(100).ease("linear").attr("transform", "translate(" + x(-1) + ",0)");
      pathZ.attr("d", line).attr("transform", null).transition().duration(100).ease("linear").attr("transform", "translate(" + x(-1) + ",0)");
     
      // pop the old data point off the front
      dataX.shift();
      dataY.shift();
      dataZ.shift();
    });

    async.series([
        function(callback) {
          console.log('connect');
          df1.connect(callback);
        },
        function(callback) {
          console.log('discoverServicesAndCharacteristics');
          df1.discoverServicesAndCharacteristics(callback);
        },
        // function(callback) {
        //   console.log('readDeviceName');
        //   df1.readDeviceName(function(deviceName) {
        //     console.log('\tdevice name = ' + deviceName);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readModelNumber');
        //   df1.readModelNumber(function(modelNumber) {
        //     console.log('\tmodel name = ' + modelNumber);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readSerialNumber');
        //   df1.readSerialNumber(function(serialNumber) {
        //     console.log('\tserial name = ' + serialNumber);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readFirmwareRevision');
        //   df1.readFirmwareRevision(function(firmwareRevision) {
        //     console.log('\tfirmware revision = ' + firmwareRevision);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readHardwareRevision');
        //   df1.readHardwareRevision(function(hardwareRevision) {
        //     console.log('\thardware revision = ' + hardwareRevision);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readSoftwareRevision');
        //   df1.readSoftwareRevision(function(softwareRevision) {
        //     console.log('\tsoftware revision = ' + softwareRevision);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readManufacturerName');
        //   df1.readManufacturerName(function(manufacturerName) {
        //     console.log('\tmanufacturer name = ' + manufacturerName);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('readBatteryLevel');
        //   df1.readBatteryLevel(function(batteryLevel) {
        //     console.log('\tbattery level = ' + batteryLevel);
        //     callback();
        //   });
        // },
        // function(callback) {
        //   console.log('setLed - red');
        //   df1.setLed(true, false, false, function() {
        //     setTimeout(callback, 1000);
        //   });
        // },
        // function(callback) {
        //   console.log('setLed - green');
        //   df1.setLed(false, true, false, function() {
        //     setTimeout(callback, 1000);
        //   });
        // },
        // function(callback) {
        //   console.log('setLed - blue');
        //   df1.setLed(false, false, true, function() {
        //     setTimeout(callback, 1000);
        //   });
        // },
        // function(callback) {
        //   console.log('setLed - off');
        //   df1.setLed(false, false, false, callback);
        // },
        function(callback) {
          console.log('notifyAccelerometer');
          df1.notifyAccelerometer(callback);
        },
        function(callback) {
          console.log('enableAccelerometer');
          df1.enableAccelerometer(callback);
        },
        // function(callback) {
        //   setTimeout(callback, 60000);
        // },
        // function(callback) {
        //   console.log('disableAccelerometer');
        //   df1.disableAccelerometer(callback);
        // },
        // function(callback) {
        //   console.log('unnotifyAccelerometer');
        //   df1.unnotifyAccelerometer(callback);
        // },
        // function(callback) {
        //   console.log('disconnect');
        //   df1.disconnect(callback);
        // }
      ]
    );
  });
});

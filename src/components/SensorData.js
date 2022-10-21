import React, {useState, useEffect, useRef} from 'react'
import CloudCard from './CloudCard'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { useWindowSize } from '../hooks/WindowSize'
import AlertIcons_Generic from "../assets/AlertIcons_Generic.png"
import MapIcon_Altitude from "../assets/MapIcon_Altitude.png"
import MapIcon_Count from "../assets/MapIcon_Count.png"
import MapIcon_Detected from "../assets/MapIcon_Detected.png"
import MapIcon_Down from "../assets/MapIcon_Down.png"
import MapIcon_Heatstroke from "../assets/MapIcon_Heatstroke.png"
import MapIcon_Pulse from "../assets/MapIcon_Pulse.png"
import MapIcon_Vehicles from "../assets/MapIcon_Vehicles.png"
import { Icon } from 'leaflet'
import { Spin } from 'antd'

const reader = new FileReader();

function SensorData({}) {
  const [data, setData] = useState({ fileData: {}, sensorData: [] });
  const [mapPosition, setMapPosition] = useState([37.769365855560956, -105.68456624550286])
  const [map, setMap] = useState(null)
  const {height, width} = useWindowSize()

  const getSeconds = timeStamp => {
  	const modifiedTimeStamp = timeStamp.replaceAll(':','');
  	const hours = 60 * 60 * modifiedTimeStamp.substr(0, 2);
  	const minutes = 60 * modifiedTimeStamp.substr(2, 2);
  	const seconds = modifiedTimeStamp.substr(4, 2);
  	return hours + minutes + seconds;
  }

  const loadNextInterval = (fileData, index) => {
  	const dataIntervals = Object.keys(fileData);
  	const dataInterval = dataIntervals[index];
    setData(prevState => {
      return {
        ...prevState,
        sensorData: [
      	  // ...prevState.sensorData,
      	  fileData[dataInterval]
        ],
      };
    });
  	if (dataIntervals.length > index + 1) {
  	  setTimeout(() => {
  	  	loadNextInterval(fileData, index + 1);
  	  }, 1000 * (getSeconds(dataIntervals[index + 1]) - getSeconds(dataInterval)));
  	}
  }

  const onFileLoad = (file) => {
    const loadedFile = JSON.parse(file.target.result);
    setData({
      fileData: loadedFile,
      sensorData: []
    });
  	loadNextInterval(loadedFile, 0);
  };

  const handleChange = upload => {
    const fileReader = new FileReader();
    fileReader.readAsText(upload.target.files[0], "UTF-8");
    fileReader.onload = onFileLoad;
  };

  const alertListItem = (index, title, lines) => {
    return (
      <div key={index + 1}>
        <h2>{title}</h2>
        <ul>{lines.map(text => <li><h3>{text}</h3></li>)}</ul>
      </div>
    );
  };

  const alertList = interval => {
    return interval.map(function(dataReading, index) {
      const sensorId = Number(dataReading["Sensor ID"]);
      if (sensorId < 2000) {
        return null;
      } else if (sensorId < 3000) {
        return null;
      } else if (sensorId < 4000) {
        return null;
      } else if (sensorId < 5000) {
        if (dataReading["Is HeatStroke"] === "True") {
          return alertListItem(
            index,
            "Temperature indicates an increased risk of heatstroke",
            [
              "Temperature: " + dataReading["Temperature"],
              "Latitude: " + dataReading["Lat"],
              "Longitude: " + dataReading["Lon"],
            ]
          );
        }
        return null;
      } else if (sensorId < 6000) {
        return null;
      } else if (sensorId < 7000) {
        return null;
      } else if (sensorId < 8000) {
        return null;
      } else if (sensorId < 9000) {
        if (dataReading["Detected"] === "True") {
          return alertListItem(
            index,
            "Smoke detected",
            [
              "Smoke detector detects smoke: " + dataReading["Detected"],
              "Latitude: " + dataReading["Lat"],
              "Longitude: " + dataReading["Lon"],
            ]
          );
        }
        return null;
      } else if (sensorId < 10000) {
        return null;
      } else if (sensorId < 11000) {
        if (dataReading["Detected"] === "True") {
          return alertListItem(
            index,
            "A wall has structural damage",
            [
              "Structural damage detected: " + dataReading["Detected"],
              "Latitude: " + dataReading["Lat"],
              "Longitude: " + dataReading["Lon"],
            ]
          );
        }
        return null;
      } else if (sensorId < 12000) {
        return null;
      } else if (sensorId < 13000) {
        if (dataReading["Down"] === "True") {
          return alertListItem(
            index,
            "A First Responder is incapacitated",
            []
          );
        }
        return null;
      }
      return <li key={index + 201}>{JSON.stringify(dataReading)}</li>;
    });
  }

  const alerts = data.sensorData.map(function(interval, index) {
    return <div key={100}>{alertList(interval)}</div>;
  });

  const sensorListItem = (index, title, lines) => {
    return (
      <li key={index + 1}>
        <h3>{title}</h3>
        {lines.map(text => <p>{text}</p>)}
      </li>
    );
  };

  const dataList = interval => {
  	return interval.map(function(dataReading, index) {
      const sensorId = Number(dataReading["Sensor ID"]);
      if (sensorId < 2000) {
        return sensorListItem(
          index,
          "Staging Automatic Vehicle Location (AVL)",
          ["FR Vehicle Count: " + dataReading["FR Vehicle Count"]]
        );
      } else if (sensorId < 3000) {
        return sensorListItem(
          index,
          "First Responder Location",
          [
            "Latitude: " + dataReading["Lat"],
            "Longitude: " + dataReading["Lon"],
            "Altitude: " + dataReading["Altitude"]
          ]
        );
      } else if (sensorId < 4000) {
        return sensorListItem(
          index,
          "Event Space Occupancy",
          ["Occupancy of bystanders in event space: " + dataReading["Count"]]
        );
      } else if (sensorId < 5000) {
        return sensorListItem(
          index,
          "Event Space Ambient Temperature",
          [
            "Latitude: " + dataReading["Lat"],
            "Longitude: " + dataReading["Lon"],
            "Increased risk of heatstroke: " + dataReading["Is Heatstroke"],

          ]
        );
      } else if (sensorId < 6000) {
        return sensorListItem(
          index,
          "First Responder Vitals",
          [
            "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
            "Pulse Rate: " + dataReading["Pulse Rate"],
            "Temperature: " + dataReading["Temperature"]
          ]
        );
      } else if (sensorId < 7000) {
        return sensorListItem(
          index,
          "Building Occupancy",
          ["Occupancy of bystanders in building: " + dataReading["Count"]]
        );
      } else if (sensorId < 8000) {
        return sensorListItem(
          index,
          "External Protest Monitoring",
          [
            "Count: " + dataReading["Count"],
            "Latitude: " + dataReading["Lat"],
            "Longitude: " + dataReading["Lon"]
          ]
        );
      } else if (sensorId < 9000) {
        return sensorListItem(
          index,
          "Hazard Identification",
          [
            "Smoke detected: " + dataReading["Detected"],
            "Latitude: " + dataReading["Lat"],
            "Longitude: " + dataReading["Lon"]
          ]
        );
      } else if (sensorId < 10000) {
        return sensorListItem(
          index,
          "Victim Vitals",
          [
            "Latitude: " + dataReading["Lat"],
            "Longitude: " + dataReading["Lon"],
            "Altitude: " + dataReading["Altitude"],
            "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
            "Pulse Rate: " + dataReading["Pulse Rate"],
            "Temperature: " + dataReading["Temperature"]
          ]
        );
      } else if (sensorId < 11000) {
        return sensorListItem(
          index,
          "Structural Hazard Detection",
          [
            "Structural damage detected: " + dataReading["Detected"],
            "Latitude: " + dataReading["Lat"],
            "Longitude: " + dataReading["Lon"]
          ]
        );
      } else if (sensorId < 12000) {
        return sensorListItem(
          index,
          "Video Feed Object Tracking",
          []
        );
      } else if (sensorId < 13000) {
        return sensorListItem(
          index,
          "First Responder Status Detection",
          ["First Responder is incapacitated: " + dataReading["Down"]]
        );
      }
	    return <li key={index + 201}>{JSON.stringify(dataReading)}</li>;
	  });
  }

  const intervals = data.sensorData.map(function(interval, index) {
    return <ul key={200}>{dataList(interval)}</ul>;
  });

  const getMarkerIcon = marker => {
    const sensorId = Number(marker["Sensor ID"]);
      if (sensorId < 2000) {
        return MapIcon_Vehicles;
      } else if (sensorId < 3000) {
        return MapIcon_Altitude;
      } else if (sensorId < 4000) {
        return MapIcon_Count;
      } else if (sensorId < 5000) {
        return MapIcon_Heatstroke;
      } else if (sensorId < 6000) {
        return MapIcon_Pulse;
      } else if (sensorId < 7000) {
        return MapIcon_Count;
      } else if (sensorId < 8000) {
        return MapIcon_Count;
      } else if (sensorId < 9000) {
        return MapIcon_Detected;
      } else if (sensorId < 10000) {
        return MapIcon_Pulse;
      } else if (sensorId < 11000) {
        return MapIcon_Detected;
      } else if (sensorId < 12000) {
        return MapIcon_Altitude;
      } else if (sensorId < 13000) {
        return MapIcon_Down;
      }
    return MapIcon_Altitude;
  }

  const markerList = markers => {
    return markers.map(function(marker, index) {
      if (marker && marker.Lat && marker.Lon) {
        return (
          <Marker
            position={[marker.Lat, marker.Lon]}
            icon={new Icon({
              iconUrl: getMarkerIcon(marker),
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })}
          >
            <Popup>
              {sensorListItem(
                index,
                "Marker",
                [JSON.stringify(marker)]
              )}
            </Popup>
          </Marker>
        );
      }
    })
  };

  const markers = data.sensorData.map(function (dataReading, index) {
    return markerList(dataReading);
  });
  const mapWidth = (width || 400) * (3 / 5) - 100;
  const sensorCount = data.sensorData[0] && Object.keys(data.sensorData[0]).length || "";
  const containerHeight = height - 300;
 
  return (
    <div>
      <CloudCard title={"Sensor Count: " + sensorCount} width={width * (1 / 5)} height={containerHeight}>
        <ul>{intervals}</ul>
      </CloudCard>
      {width > 0 && <CloudCard title={"Rendered SensorData View"} width={mapWidth}>
        <MapContainer 
          ref={setMap}
          style={{ height: containerHeight, width: "auto" }} 
          center={mapPosition} 
          zoom={20}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
          </MapContainer>
	    </CloudCard>}
      <CloudCard title={"Critical Alerts"} width={width * (1 / 5)} height={containerHeight}>
        <h4>Upload JSON sensor data file:</h4>
        <input type="file" onChange={handleChange} />
        {alerts}
        <br/>
        <br/>
      </CloudCard>
    </div>
  )
}

SensorData.propTypes = {}

export default SensorData

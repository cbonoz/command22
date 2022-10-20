import React, {useState, useEffect, useRef} from 'react'
import CloudCard from './CloudCard'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { useWindowSize } from '../hooks/WindowSize'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
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

  const alertList = interval => {
    return interval.map(function(dataReading, index) {
      if (dataReading["Is HeatStroke"] === "True") {
        return <li key={index + 1}>{"Heat Stroke Detected!"}</li>;
      }
      if (dataReading["Down"] === "True") {
        return <li key={index + 101}>{"Person Down Detected!"}</li>;
      }
    });
  }

  const alerts = data.sensorData.map(function(interval, index) {
    return <ul key={100}>{alertList(interval)}</ul>;
  });

  const dataList = interval => {
  	return interval.map(function(dataReading, index) {
	    return <li key={index + 201}>{JSON.stringify(dataReading)}</li>;
	  });
  }

  const intervals = data.sensorData.map(function(interval, index) {
    return <ul key={200}>{dataList(interval)}</ul>;
  });

  const markerList = markers => {
    return markers.map(function(marker, index) {
      if (marker && marker.Lat && marker.Lon) {
        return (
          <Marker
            position={[marker.Lat, marker.Lon]}
            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
          >
            <Popup>
              {JSON.stringify(marker)}
            </Popup>
          </Marker>
        );
      }
    })
  };

  const markers = data.sensorData.map(function (dataReading, index) {
    return markerList(dataReading);
  });
  const w = width || 400
  const mapWidth = w * (3 / 5) - 100;
  const containerHeight = height - 300;
 
  return (
    <div>
      <CloudCard title={"Upload sensor data"} width={w * (2 / 5)} height={containerHeight}>
	      <h1>Upload JSON sensor data file:</h1>
		    <input type="file" onChange={handleChange} />
		    <br />
        <ul>{alerts}</ul>
      	<ul>{intervals}</ul>
      </CloudCard>
      {width > 0 && <CloudCard title={"Rendered SensorData View"} width={mapWidth}>
        <MapContainer 
          ref={setMap}
          style={{ height: containerHeight, width: "auto" }} 
          center={mapPosition} 
          zoom={13}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers}

          </MapContainer>

	    </CloudCard>}
    
    </div>
  )
}

SensorData.propTypes = {}

export default SensorData

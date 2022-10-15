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
  const [mapPosition, setMapPosition] = useState([34.0522, -118.2437])
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
      	  ...prevState.sensorData,
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

  const dataList = interval => {
  	return interval.map(function(dataReading, index) {
  	  if (dataReading["Is HeatStroke"] === "True") {

  	  }
  	  if (dataReading["Down"] === "True") {
  	  	window.alert("Person Down Detected!", { tag: "Down" });
  	  }
	  return <li key={index}>{JSON.stringify(dataReading)}</li>;
	});
  }

  const intervalList = data.sensorData.map(function(interval, index) {
    return <ul key={index}>{dataList(interval)}</ul>;
  });

  const mapWidth = (width || 400) - 400;
  // console.log('width', mapWidth)
 
  return (
    <div>
        <CloudCard title={"Upload sensor data"} width={300} height={600}>
	      <h1>Upload JSON sensor data file:</h1>
		    <input type="file" onChange={handleChange} />
		    <br />
      	<ul>{ intervalList }</ul>
      </CloudCard>
      {width > 0 && <CloudCard title={"Rendered SensorData View"} height={600} width={mapWidth}>
        <MapContainer 
          ref={setMap}
          style={{ height: "500px", width: "auto" }} 
          center={mapPosition} 
          zoom={15}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapPosition}
            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>

          </MapContainer>

	    </CloudCard>}
    
    </div>
  )
}

SensorData.propTypes = {}

export default SensorData

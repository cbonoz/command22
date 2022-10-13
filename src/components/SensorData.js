import React, {useState, useEffect} from 'react'
import CloudCard from './CloudCard'
import PointCloud from './PointCloud'
import { Empty, Select } from 'antd'
import { FileUploader } from 'react-drag-drop-files'

const reader = new FileReader();

function SensorData({}) {
  const [data, setData] = useState({ fileData: {}, sensorData: [] });

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
  	  	window.alert("Heat Stroke Detected!", { tag: "Is HeatStroke" });
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
 
  return (
    <div>
      <CloudCard minHeight={500} title={"Rendered SensorData View"} width={800}>
	    <h1>Upload Json file - Example</h1>
		<input type="file" onChange={handleChange} />
		<br />
      	<ul>{ intervalList }</ul>
      </CloudCard>
    </div>
  )
}

SensorData.propTypes = {}

export default SensorData

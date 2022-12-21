import React, { useState, useEffect, useRef } from 'react'
import CloudCard from './CloudCard'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { useWindowSize } from '../hooks/WindowSize'
import IndoorMap from "../assets/NIST_Reference_2.png"
import sensor_legend from "../assets/sensor_legend.png"
import camera_icon from '../assets/camera_icon.png'

import { Icon } from 'leaflet'
import { Button, Card, Col, Modal, Row, Spin, } from 'antd'
import { getCameras } from '../api'
import { getReadableError, getSensorDataList, markerList, tab, createCardItem } from '../util'
import VideoStream from './VideoStream'
import LidarMap from './LidarMap'
import { EXAMPLE_SENSOR_DATA } from '../util/constants'

function SensorData({ user }) {
  // TODO: replace EXAMPLE_SENSOR_DATA with fetched data from the sensor API.
  const [data, setData] = useState({ fileData: {}, sensorData: EXAMPLE_SENSOR_DATA });
  const [mapPosition, setMapPosition] = useState([37.769021575, -105.68439389])
  const mapRef = useRef()
  const [video, setVideo] = useState(null)
  const [videos, setVideos] = useState()

  const [alerts, setAlerts] = useState([])
  const [markers, setMarkers] = useState([])
  const [intervals, setIntervals] = useState([])
  const { height, width } = useWindowSize()

  async function cameras() {
    console.log('cameras')
    try {
      const cameras = await getCameras(true)
      console.log('cameras', cameras)
      setVideos(cameras)
    } catch (e) {
      console.error('err', e)
      const msg = getReadableError(e)
      alert('Error getting video streams: ' + msg)
    }
  }
  useEffect(() => {
    cameras()
  }, [])


  const getSeconds = timeStamp => {
    const modifiedTimeStamp = timeStamp.replaceAll(':', '');
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

  const clickableMapAlert = (index, title, lines, dataReading, className) => {
    return createCardItem(
      index,
      title,
      lines,
      className,
      () => {
        // use the map ref to move the map to the correct location
        try {
          const loc = {
            lat: dataReading["Lat"],
            lon: dataReading["Lon"]
          }
          console.log('goTo', loc)
          mapRef.current.flyTo(loc, 14, { duration: 2 });
        } catch (e) {
          console.error('Could not go to alert location', e);
        }
      }
    )
  }

  const alertList = interval => {
    return interval.map(function (dataReading, index) {
      const sensorId = Number(dataReading["Sensor ID"]);

      if (sensorId < 4000) {
        return null;
      } else if (sensorId < 5000) {
        if (dataReading["Is HeatStroke"] === "True") {
          return clickableMapAlert(
            index,
            "Increased risk of heatstroke",
            [
              "Temperature: " + dataReading["Temperature"],
              "Latitude: " + dataReading["Lat"],
              "Longitude: " + dataReading["Lon"],
            ],
            dataReading,
            'risk-card'
          );
        }
        return null;
      } else if (sensorId < 6000) {
        if (Number(dataReading["Temperature"]) > 100) {
          return clickableMapAlert(
            index,
            "High First Responder temperature",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        if (Number(dataReading["Temperature"]) < 80) {
          return clickableMapAlert(
            index,
            "Low First Responder temperature",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        if (Number(dataReading["Pulse Rate"]) > 105) {
          return clickableMapAlert(
            index,
            "High First Responder pulse rate",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        if (Number(dataReading["Pulse Rate"]) < 60) {
          return clickableMapAlert(
            index,
            "Low First Responder pulse rate",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        return null;
      } else if (sensorId < 7000) {
        return null;
      } else if (sensorId < 8000) {
        return null;
      } else if (sensorId < 9000) {
        if (dataReading["Detected"] === "True") {
          return clickableMapAlert(
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
        if (Number(dataReading["Temperature"]) > 100) {
          return clickableMapAlert(
            index,
            "High victim temperature",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        if (Number(dataReading["Temperature"]) < 80) {
          return clickableMapAlert(
            index,
            "Low victim temperature",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        if (Number(dataReading["Pulse Rate"]) > 105) {
          return clickableMapAlert(
            index,
            "High victim pulse rate",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        if (Number(dataReading["Pulse Rate"]) < 60) {
          return clickableMapAlert(
            index,
            "Low victim pulse rate",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ]
          );
        }
        return null;
      } else if (sensorId < 11000) {
        if (dataReading["Detected"] === "True") {
          return clickableMapAlert(
            index,
            "A wall has structural damage",
            [
              "Structural damage detected: " + dataReading["Detected"],
              "Latitude: " + dataReading["Lat"],
              "Longitude: " + dataReading["Lon"],
            ],
            dataReading,
            'risk-card'
          );
        }
        return null;
      } else if (sensorId < 12000) {
        return null;
      } else if (sensorId < 13000) {
        if (dataReading["Down"] === "True") {
          return clickableMapAlert(
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

  useEffect(() => {

    const { sensorData } = data
    const sensorTimes = Object.keys(sensorData)

    const newAlerts = sensorTimes.map(function (interval, index) {
      return <>{alertList(sensorData[interval])}</>;
    });

    const newIntervals = sensorTimes.map(function (interval, index) {
      return <>{getSensorDataList(sensorData[interval])}</>;
    });

    const newMarkers = sensorTimes.map(function (interval, index) {
      return markerList(sensorData[interval]);
    });

    setAlerts(newAlerts)
    setIntervals(newIntervals)
    setMarkers(newMarkers)
  }, [data])


  const mapWidth = (width || 400) * (3 / 5) - 100;
  // const sensorCount = data.sensorData[0] && Object.keys(data.sensorData[0]).length || "";
  const containerHeight = height || 800;

  const leftTabs = {
    'sensors': <div>{intervals}</div>,
    'cameras': <div>
      {videos?.map((v, i) => {
        return createCardItem(
          i,
          `Camera: ${v.name}`,
          Object.keys(v).map((k) => `${k}: ${v[k]}`),
          'pointer',
          () => {
            setVideo(v)
          }

        )
      })}
    </div>
  }

  const centerTabs = {
    "2d map": <MapContainer
      ref={mapRef}
      style={{ height: containerHeight, width: "auto" }}
      center={mapPosition}
      zoom={20}
      maxZoom={25}
      zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[37.76928602, -105.68460486]}
        icon={new Icon({
          iconUrl: IndoorMap,
          iconSize: [500, 780],
          iconAnchor: [50, 80]
        })}
      >
      </Marker>
      {markers}
      <Marker
        position={[37.76935602, -105.68515486]}
        icon={new Icon({
          iconUrl: sensor_legend,
          iconSize: [200, 500],
          iconAnchor: [0, 0]
        })}
      >
      </Marker>

      {(videos || []).map((video, index) => {
        return <Marker
          eventHandlers={{
            click: (e) => {
              console.log('clicked', video)
              setVideo(video);
            },
          }}
          key={index}
          position={[video.lat, video.long]}
          icon={new Icon({
            iconUrl: camera_icon,
            iconSize: [50, 50],
            iconAnchor: [0, 0]
          })} />
      })}
    </MapContainer>
    , "lidar map": <div>
      <LidarMap user={user} />

    </div>

  }

  const rightTabs = {
    'critical alerts': <div>{alerts}</div>
  }

  return (
    <div className='body-padding'>
      <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 16 }}>
        <Col xs={{ span: 24, order: 2 }} md={{ span: 24, order: 2 }} xl={6} order={2}>
          <CloudCard
            maxHeight={containerHeight}
            overflowY='scroll'
            tabs={[tab("SENSORS"), tab("CAMERAS")]}
            tabsContent={leftTabs}
          />
        </Col>
        <Col xs={{ span: 24, order: 1 }} md={{ span: 24, order: 2 }} xl={12} order={1}>
          <CloudCard
            tabs={[tab("2D MAP"), tab("LiDAR MAP")]}
            tabsContent={centerTabs}
          />
        </Col>
        <Col xs={{ span: 24, order: 3 }} md={{ span: 24, order: 2 }} xl={6} order={3}>
          <CloudCard tabs={[tab("CRITICAL ALERTS")]}
            maxHeight={containerHeight}
            overflowY='scroll'
            tabsContent={rightTabs}
          >
            <br />
            <br />
          </CloudCard>
        </Col>

        <Modal
          width={800}
          open={!!video}
          onCancel={() => setVideo(null)}
          onOk={() => setVideo(null)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          title={`Camera: ${video?.name || "Video Feed"}`}
          centered
        >
          <VideoStream video={video} />
        </Modal>

        {/* <h4>Upload JSON sensor data file:</h4>
      // <input type="file" onChange={handleChange} /> */}

      </Row>
    </div>
  )
}

SensorData.propTypes = {}

export default SensorData

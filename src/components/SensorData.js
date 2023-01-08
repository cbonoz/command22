import React, { useState, useEffect, useRef } from 'react'
import CloudCard from './CloudCard'
import { MapContainer, TileLayer, useMap, Marker, Popup, LayersControl, ImageOverlay } from 'react-leaflet'
import { useWindowSize } from '../hooks/WindowSize'
import IndoorMap from "../assets/NIST_Reference_2.png"
import sensor_legend from "../assets/sensor_legend.png"
import camera_icon from '../assets/camera_icon.png'

import { Icon, LatLngBounds, control, DomUtil } from 'leaflet'
import { Button, Col, Input, Modal, Row, Switch, } from 'antd'
import { getCameras, retrieveAccessToken, retrieveSensorData } from '../api'
import { getReadableError, getSensorDataList, markerList, tab, createCardItem, capitalize } from '../util'
import VideoStream from './VideoStream'
import LidarMap from './LidarMap'
import { DEFAULT_GUTTER, EXAMPLE_SENSOR_DATA, PLAN_DOC, } from '../util/constants'
import RenderObject from './RenderObject'

const INDOOR_MAP_BOUNDS = new LatLngBounds([37.76928602, -105.68418292], [37.76875713, -105.68460486])

function SensorData({ user }) {
  // TODO: replace EXAMPLE_SENSOR_DATA with fetched data from the sensor API.
  const [data, setData] = useState({ fileData: {}, sensorData: JSON.parse(EXAMPLE_SENSOR_DATA.data) });
  const [mapPosition, setMapPosition] = useState([37.769021575, -105.68439389])
  const [doc, setDoc] = useState(localStorage?.getItem('PLAN_URL') || PLAN_DOC)
  const [editing, setEditing] = useState(true)
  const mapRef = useRef()
  const [video, setVideo] = useState(null)
  const [videos, setVideos] = useState()
  const [activeAlertIndex, setActiveAlertIndex] = useState(null)

  const [alerts, setAlerts] = useState([])
  const [markers, setMarkers] = useState([])
  const [intervals, setIntervals] = useState([])
  const { height, width } = useWindowSize()

  // Sensor Data API
  const [accessToken, setAccessToken] = useState([])
  const [refreshToken, setRefreshToken] = useState([])

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
    retrieveAccessToken().then((response) => {
      console.log(response)
      setAccessToken(response.access_token)
      setRefreshToken(response.refresh_token)

      retrieveSensorData(response.access_token).then((response) => {
        const sensorData = response.data.data
        console.log('sensor data', sensorData)
      })
    })

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

   const onEditingChange = (value) => {
    setEditing(value)
    // Not editing anymore, save the value.
    console.log('onEditingChange', value, doc)
    if (value) {
      localStorage.setItem('PLAN_URL', doc)
    }

  }

  const flyTo = (lat, lon) => {
    try {
      console.log('flyTo', lat, lon)
      mapRef.current.flyTo({ lat, lon }, 14, { duration: 2 });
    } catch (e) {
      console.error('Could fly to location', e);
    }
  }

  const clickableMapAlert = (index, title, lines, dataReading, className) => {
    const isActive = activeAlertIndex === index && dataReading?.Lat // has location
    const classes = `${className} ${isActive ? 'active' : ''}`
    return createCardItem(
      index,
      title,
      lines,
      classes,
      () => {
        console.log('clickableMapAlert', index, title, lines, dataReading, classes)
        // Clear or set active index.
        setActiveAlertIndex(isActive ? null : index)
        // use the map ref to move the map to the correct location
        if (dataReading) {
          flyTo(dataReading["Lat"], dataReading["Lon"])
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
  }, [data, activeAlertIndex])


  // const sensorCount = data.sensorData[0] && Object.keys(data.sensorData[0]).length || "";
  const containerHeight = (height - 200) || 800;

  const leftTabs = {
    'sensors': <div>{intervals}</div>,
    'cameras': <div>
      {videos?.map((v, i) => {
        return createCardItem(
          i,
          `Camera: ${v.name}`,
          Object.keys(v).map((k) => `${capitalize(k)}: ${v[k]}`),
          'pointer',
          () => {
            setVideo(v)
            flyTo(v.lat, v.long)
          }

        )
      })}
    </div>
  }

  // TODO: determine why doesn't render on tab back.
  function Legend({ map }) {
    useEffect(() => {
      if (map) {
        const legend = control({ position: "bottomright" });

        legend.onAdd = () => {
          const div = DomUtil.create("div", "info legend");
          div.innerHTML = "<img src=" + sensor_legend + " class='legend-image' />";
          return div;
        };

        try {
          legend.addTo(map);
        } catch (e) {
          console.error(e)
        }
      }
    }, [map]);
    return null;
  }

  const centerTabs = {
    "2d map": <MapContainer
      ref={mapRef}
      style={{ height: containerHeight, width: "auto" }}
      center={mapPosition}
      zoom={15}
      maxZoom={22}
      zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LayersControl position="topright">
        {/* <LayersControl.Overlay name="Show Legend"> */}
        <Legend map={mapRef?.current} />
        {/* </LayersControl.Overlay> */}

        <LayersControl.Overlay name="Indoor Map">
          <ImageOverlay url={IndoorMap}
            bounds={INDOOR_MAP_BOUNDS}
            opacity={0.5}
            zIndex={10}
          />
        </LayersControl.Overlay>

      </LayersControl>
      {markers}
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
    </div>,
    "planning":
      <div>
        <Input
          disabled={editing}
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          placeholder="Enter Planning Doc URL"
          style={{ width: '100%', marginBottom: '10px', marginRight: '5px' }}
        />

        <Switch checkedChildren="Editing" unCheckedChildren="Set url" checked={editing} onChange={v => onEditingChange(v)} />
        <br/>
        <div style={{ width: '100%', minHeight: '400px' }}>
        {doc && editing && <iframe src={doc} style={{ width: '100%', minHeight: containerHeight }} />}
        </div>

      </div>
  }

  const rightTabs = {
    'critical alerts': <div>{alerts}</div>
  }

  return (
    <div className='body-padding'>
      <Row gutter={DEFAULT_GUTTER}>
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
            tabs={[tab("2D MAP"), tab("LiDAR MAP"), tab("PLANNING")]}
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
          width={'80%'}
          open={!!video}
          onCancel={() => setVideo(null)}
          onOk={() => setVideo(null)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          title={<RenderObject
            style={{ maxWidth: '400px' }}
            title={`camera - ${video?.name || 'No Camera Selected'}`}
            obj={video}></RenderObject>}
          centered
        >
          <VideoStream video={video} />
        </Modal>

        {/* <h4>Upload JSON sensor data file:</h4>
      // <input type="file" onChange={handleChange} /> */}

      </Row>
    </div >
  )
}

SensorData.propTypes = {}

export default SensorData

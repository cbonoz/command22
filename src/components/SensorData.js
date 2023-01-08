import React, { useState, useEffect, useRef } from 'react'
import CloudCard from './CloudCard'
import { MapContainer, TileLayer, useMap, Marker, Popup, LayersControl, ImageOverlay } from 'react-leaflet'
import { useWindowSize } from '../hooks/WindowSize'
import IndoorMap from "../assets/NIST_Reference_2.png"
import sensor_legend from "../assets/sensor_legend.png"
import camera_icon from '../assets/camera_icon.png'

import { Icon, LatLngBounds, control, DomUtil } from 'leaflet'
import { Button, Col, Input, Modal, Row, Switch, } from 'antd'
import { getCameras } from '../api'
import { getReadableError, getSensorDataList, markerList, tab, createCardItem, capitalize } from '../util'
import VideoStream from './VideoStream'
import LidarMap from './LidarMap'
import { DEFAULT_GUTTER, EXAMPLE_SENSOR_DATA, PLAN_DOC, RTE_CONFIG } from '../util/constants'
import RenderObject from './RenderObject'
import RichTextEditor, { EditorValue } from 'react-rte'

const INDOOR_MAP_BOUNDS = new LatLngBounds([37.76928602, -105.68418292], [37.76875713, -105.68460486])

function SensorData({ user }) {
  // TODO: replace EXAMPLE_SENSOR_DATA with fetched data from the sensor API.
  const [data, setData] = useState({ fileData: {}, sensorData: JSON.parse(EXAMPLE_SENSOR_DATA.data) });
  const [mapPosition, setMapPosition] = useState([37.769021575, -105.68439389])
  const [doc, setDoc] = useState(PLAN_DOC)
  const [editing, setEditing] = useState(true)
  const mapRef = useRef()
  const [video, setVideo] = useState(null)
  const [videos, setVideos] = useState()
  const [editorValue, setEditorValue] = useState(RichTextEditor.createEmptyValue())
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

  async function retrieveAccessToken(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: data // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function retrieveSensorData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Authorization': 'bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  useEffect(() => {
    cameras()
    const url = 'https://api.commandingtechchallenge.com/login'
    const params = new URLSearchParams()
    params.append('username', 'CloudResponder')
    params.append('password', 'Qh*v2@OK8rm7')
    retrieveAccessToken(url, params).then((response) => {
      console.log(response)
      setAccessToken(response.access_token)
      setRefreshToken(response.refresh_token)

      const url = 'https://api.commandingtechchallenge.com/get_data'
      retrieveSensorData(url).then((response) => {
        console.log(response)
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

  const flyTo = (lat, lon) => {
    try {
      console.log('flyTo', lat, lon)
      mapRef.current.flyTo({ lat, lon }, 14, { duration: 2 });
    } catch (e) {
      console.error('Could fly to location', e);
    }
  }

  const clickableMapAlert = (index, title, lines, dataReading, className) => {
    const classes = `${className} ${activeAlertIndex === index ? 'active' : ''}`
    return createCardItem(
      index,
      title,
      lines,
      classes,
      () => {
        console.log('clickableMapAlert', index, title, lines, dataReading, classes)
        // Clear or set active index.
        setActiveAlertIndex(activeAlertIndex === index ? null : index)
        // use the map ref to move the map to the correct location
        flyTo(dataReading["Lat"], dataReading["Lon"])
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

  const onEditorChange = (value) => {
    // console.log('Content was updated:', value)
    setEditorValue(value)
    // Get changes as an HTML string.
    // This is here to demonstrate using `.toString()` but in a real app it
    // would be better to avoid generating a string on each change.
    // value.toString('html')
  };

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
      <LidarMap user={user} />,
    </div>,
    "planning":
      <div>
        <div style={{ width: '100%', minHeight: containerHeight }}>
          <Input
            disabled={editing}
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            placeholder="Enter Planning Doc URL"
            style={{ width: '100%', marginBottom: '10px', marginRight: '5px' }}
          />

          <Switch checkedChildren="Editing" unCheckedChildren="Set url" checked={editing} onChange={setEditing} />
          <br/>
          {editing && <iframe src={doc} style={{ width: '100%', minHeight: containerHeight }} />}
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

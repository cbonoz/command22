import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import CloudCard from './CloudCard'
import { MapContainer, TileLayer, useMap, Marker, Popup, LayersControl, ImageOverlay, FeatureGroup } from 'react-leaflet'
import { useWindowSize } from '../hooks/WindowSize'
import IndoorMap from "../assets/BuildingMap_NoLatLong.png"
import sensor_legend from "../assets/sensor_legend.png"
import camera_icon from '../assets/Icon_Standard_VideoFeedObjectTracking.png'
import marker_icon from '../assets/Icon_Standard_Generic.png'


import { Icon, LatLngBounds, control, DomUtil } from 'leaflet'
import { Button, Col, Input, Modal, Row, Switch, } from 'antd'
import { getCameras, retrieveAccessToken, retrieveSensorData } from '../api'
import { getReadableError, getSensorDataList, markerList, tab, createCardItem, capitalize, isValidJSON } from '../util'
import VideoStream from './VideoStream'
import LidarMap from './LidarMap'
import { DEFAULT_GUTTER, EXAMPLE_SENSOR_DATA, PLAN_DOC, TEST_INTEREST_POINTS, } from '../util/constants'
import RenderObject from './RenderObject'
import { EditControl } from 'react-leaflet-draw'

const INDOOR_MAP_BOUNDS = new LatLngBounds([37.76928602, -105.68418292], [37.76875713, -105.68460486])

function SensorData({ user }) {
  // TODO: replace EXAMPLE_SENSOR_DATA with fetched data from the sensor API.
  const [sensorData, setSensorData] = useState()
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
  const [centerMap, setCenterMap] = useState(true)
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


  const onEditingChange = (value) => {
    setEditing(value)
    // Not editing anymore, save the value.
    console.log('onEditingChange', value, doc)
    if (value) {
      localStorage.setItem('PLAN_URL', doc)
    }

  }

  const flyTo = (lat, lon, zoom = 21) => {
    try {
      console.log('flyTo', lat, lon)
      mapRef.current.flyTo({ lat, lon }, zoom, { duration: 2 });
    } catch (e) {
      console.error('Could fly to location', e);
    }
  }

  const clickableMapAlert = (index, title, lines, dataReading, className) => {
    const isActive = activeAlertIndex === index && dataReading?.Lat // has location
    const classes = `${className || ''} ${isActive ? 'active' : ''}`
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
      const id = Number(dataReading["Sensor ID"]);
      const sensorId = id < 20000 ? id * 10 : id;
      if (sensorId < 40000) {
        return null;
      } else if (sensorId < 50000) {
        if (dataReading["Is HeatStroke"] === "True") {
          return clickableMapAlert(
            index,
            "Heatstroke Risk",
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
      } else if (sensorId < 60000) {
        if (Number(dataReading["Temperature"]) > 100) {
          return clickableMapAlert(
            index,
            "First Responder High Temperature",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        if (Number(dataReading["Temperature"]) < 95) {
          return clickableMapAlert(
            index,
            "First Responder Hypothermia Warning",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        if (Number(dataReading["Pulse Rate"]) > 105) {
          return clickableMapAlert(
            index,
            "First Responder High Pulse",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        if (Number(dataReading["Pulse Rate"]) < 60) {
          return clickableMapAlert(
            index,
            "First Responder Low Pulse",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        return null;
      } else if (sensorId < 80000) {
        return null;
      } else if (sensorId < 90000) {
        if (dataReading["Detected"] === "True") {
          return clickableMapAlert(
            index,
            "Smoke Detected",
            [
              "Smoke detector detects smoke: " + dataReading["Detected"],
              "Latitude: " + dataReading["Lat"],
              "Longitude: " + dataReading["Lon"],
            ],
            dataReading,
            'risk-card'
          );
        }
        return null;
      } else if (sensorId < 100000) {
        if (Number(dataReading["Temperature"]) > 100) {
          return clickableMapAlert(
            index,
            "Victim High Temperature",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        if (Number(dataReading["Temperature"]) < 95) {
          return clickableMapAlert(
            index,
            "Victim Hypothermia Warning",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        if (Number(dataReading["Pulse Rate"]) > 105) {
          return clickableMapAlert(
            index,
            "Victim High Pulse",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          );
        }
        if (Number(dataReading["Pulse Rate"]) < 60) {
          return clickableMapAlert(
            index,
            "Victim Low Pulse",
            [
              "Pulse Oxygen: " + dataReading["Pulse Oxygen"],
              "Pulse Rate: " + dataReading["Pulse Rate"],
              "Temperature: " + dataReading["Temperature"],
            ],
            dataReading,
            'risk-card'
          )
          ;
        }
        return null;
      } else if (sensorId < 110000) {
        if (dataReading["Detected"] === "True") {
          return clickableMapAlert(
            index,
            "Structural Damage",
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
      } else if (sensorId < 120000) {
        return null;
      } else if (sensorId < 130000) {
        if (dataReading["Down"] === "True") {
          return clickableMapAlert(
            index,
            "First Responder Incapacitated",
            [],
            dataReading,
            'risk-card'
          );
        }
        return null;
      } else if (sensorId < 140000) {
        return null;
      }
      return <li key={index + 201}>{JSON.stringify(dataReading)}</li>;
    });
  }

  useEffect(() => {
    if (!sensorData) {
      return
    }
    const sensorTimes = Object.keys(sensorData)

    const newAlerts = sensorTimes.map(function (interval, index) {
      return <span key={index}>{alertList(sensorData[interval])}</span>;
    });
    const newIntervals = sensorTimes.map(function (interval, index) {
      return <span key={index}>{getSensorDataList(sensorData[interval], clickableMapAlert)}</span>;
    });
    const newMarkers = sensorTimes.map(function (interval, index) {
      return <span key={index}>{markerList(sensorData[interval])}</span>
    });
    if (centerMap) {
      let mapCentered = false
      for (const key of Object.keys(sensorData)) {
        if (!mapCentered) {
          console.log(sensorData[key])
          for (let responseItem of sensorData[key]) {
            const { Lat, Lon } = responseItem
            if (Lat && Lon) {
              flyTo(Number(Lat), Number(Lon), 20)
              mapCentered = true
            }
          }
        }
        setCenterMap(false)
      }
      console.log(sensorData)

    }
    setAlerts(newAlerts)
    setIntervals(newIntervals)
    setMarkers(newMarkers)
  }, [sensorData])


  const readData = (token) => {
    retrieveSensorData(token).then((response) => {
      if (isValidJSON(response.data.data)) {
        const responseData = JSON.parse(response.data.data)
        setSensorData(responseData)
        
      }
      setTimeout(() => {
        readData(token)
      }, 1000)
    })
  }

  useEffect(() => {
    cameras()
    retrieveAccessToken().then((response) => {
      console.log(response)
      setAccessToken(response.access_token)
      setRefreshToken(response.refresh_token)
      readData(response.access_token, true)
    }).catch(e => {
      console.error('token error', e)
      setSensorData(EXAMPLE_SENSOR_DATA.data)

    })
  }, [])


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

  const centerTabs = {
    "2d map":
    <div style={{
      position: 'relative',
    }}>
    <MapContainer
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

<FeatureGroup>
    <EditControl
      position='topright'
      draw={{
        rectangle: false,
        marker:
        {
          icon: new Icon({
            iconUrl: marker_icon,
            iconSize: [25, 40],
            iconAnchor: [12, 40]
          })
        }
      }}
    />
  </FeatureGroup>

      <LayersControl position="topright">
        {/* <LayersControl.Overlay name="Show Legend"> */}

        <LayersControl.Overlay checked name="Indoor Map">
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
            iconSize: [25, 40],
            iconAnchor: [12, 40]
          })} />
      })}
    </MapContainer>
    <img src={sensor_legend} className='legend-image' /> 
</div>
    , "lidar map": <div style={{minHeight: containerHeight}}>
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
        <br />
        <div style={{ width: '100%', minHeight: '400px' }}>
          {doc && editing && <iframe src={doc} style={{ width: '100%', minHeight: containerHeight - 50 }} />}
        </div>

      </div>
  }

  const rightTabs = {
    'critical alerts': <div>{alerts}</div>
  }

  return (
    <div className='body-padding'>
      <Row gutter={DEFAULT_GUTTER}>
        <Col xs={{ span: 24, order: 2 }} md={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }}>
          <CloudCard
            minHeight={containerHeight}
            maxHeight={containerHeight}
            overflowY='scroll'
            tabs={[tab("SENSORS"), tab("CAMERAS")]}
            tabsContent={leftTabs}
          />
        </Col>
        <Col xs={{ span: 24, order: 1 }} md={{ span: 24, order: 1 }}  lg={{ span: 12, order: 2 }}>
          <CloudCard
          maxHeight={containerHeight}
            tabs={[tab("2D MAP"), tab("LiDAR MAP"), tab("PLANNING")]}
            tabsContent={centerTabs}
          />
        </Col>
        <Col xs={{ span: 24, order: 3 }} md={{ span: 12, order: 3 }} lg={{ span: 6, order: 3 }}>
          <CloudCard tabs={[tab("CRITICAL ALERTS")]}
            minHeight={containerHeight}
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

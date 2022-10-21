import React, {useState, useEffect} from 'react'
import CloudCard from './CloudCard'
import PointCloud from './PointCloud'
import { Card, Empty, Select } from 'antd'
import { FileUploader } from 'react-drag-drop-files'
import { useWindowSize } from '../hooks/WindowSize'
import { TEST_INTEREST_POINTS } from '../util/constants'
import { getReadableDateTime } from '../util'

const reader = new FileReader();


function Map({}) {
  const [plyData, setPlyData] = useState()
  const [interestPoints, setInterestPoints] = useState([])
  const {width, height} = useWindowSize()

  reader.addEventListener("load", () => {
    // convert image file to base64 string
    console.log('done', reader.result)
    setPlyData(reader.result)
    setInterestPoints(TEST_INTEREST_POINTS)
  }, false);

  const handleChange = (f) => {
    reader.readAsDataURL(f)
    // const s = createObjectUrl(f)
    // console.log('s', s)
    // setPlyData(s)
}

  const sceneWidth = Math.max(400, width-400)
 
  return (
    <div>
        <CloudCard title={"Rendered Map View"} width={sceneWidth}>
        <FileUploader
          label={"Upload a .ply file to render here"} 
          multiple={false}
          handleChange={handleChange}
          name="file"
          types={['ply']}
        />
        <span>Once loaded, use 'WASD' keys to control the camera.</span>
        <br/>
        {/* https://stackoverflow.com/questions/71467209/three-js-ply-loader-object-not-rendered-properly */}
            <PointCloud 
              width={sceneWidth-40} 
              height={height-300} 
              plyFile={plyData}
              onPointSelect={(point) => {
                alert('Selected: ' + JSON.stringify(point))
              }}
            />
        </CloudCard>
        <CloudCard title={"Points of Interest"} width={360}>
            {interestPoints.length === 0 && <Empty className='standard-padding' description="No points of interest available"/>}
            {interestPoints.map((pt, i) => {
              const {Lat, Lon, Time} = pt
              return <Card title={`Sensor Alert: ${pt['Sensor ID']}`} key={i}>
                Lat: {Lat}<br/>
                Lng: {Lon}<br/>
                Time: {Time}
              </Card>
            })}
        </CloudCard>
    </div>
  )
}

Map.propTypes = {}

export default Map

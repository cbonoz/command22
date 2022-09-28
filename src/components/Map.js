import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import CloudCard from './CloudCard'
import PointCloud from './PointCloud'
import { Empty, Select } from 'antd'
import { PLY_FILES } from '../util/constants'
import { FileUploader } from 'react-drag-drop-files'
import { createObjectUrl } from '../util'

const reader = new FileReader();


function Map({}) {
  const [plyData, setPlyData] = useState()


  reader.addEventListener("load", () => {
    // convert image file to base64 string
    console.log('done', reader.result)
    setPlyData(reader.result)
  }, false);

  const handleChange = (f) => {
    reader.readAsDataURL(f)
    // const s = createObjectUrl(f)
    // console.log('s', s)
    // setPlyData(s)
}

 
  return (
    <div>
        <CloudCard title={"Map View"} width={1000} height={600}>
        <FileUploader
                multiple={false}
                handleChange={handleChange}
                name="file"
                types={['ply']}
            />
        {/* https://stackoverflow.com/questions/71467209/three-js-ply-loader-object-not-rendered-properly */}
            <PointCloud width={800} height={400} plyFile={plyData}/>
        </CloudCard>
        <CloudCard title={"Points of Interest"} width={400}>
            <Empty className='standard-padding' description="No points of interest available"/>
        </CloudCard>
    </div>
  )
}

Map.propTypes = {}

export default Map

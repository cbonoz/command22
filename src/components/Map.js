import React, {useState, useEffect} from 'react'
import CloudCard from './CloudCard'
import PointCloud from './PointCloud'
import { Empty, Select } from 'antd'
import { FileUploader } from 'react-drag-drop-files'

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
        <CloudCard title={"Rendered Map View"} width={800} height={600}>
        <FileUploader
          label={"Upload a .ply file to render here"} 
          multiple={false}
          handleChange={handleChange}
          name="file"
          types={['ply']}
        />
        <br/>
        {/* https://stackoverflow.com/questions/71467209/three-js-ply-loader-object-not-rendered-properly */}
            <PointCloud width={700} height={500} plyFile={plyData}/>
        </CloudCard>
        <CloudCard title={"Points of Interest"} width={400}>
            <Empty className='standard-padding' description="No points of interest available"/>
        </CloudCard>
    </div>
  )
}

Map.propTypes = {}

export default Map

import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import CloudCard from './CloudCard'
import PointCloud from './PointCloud'
import { Empty, Select } from 'antd'
import { PLY_FILES } from '../util/constants'

const {Option} = Select;

function Map(props) {
 
  return (
    <div>
        <CloudCard title={"Map View"} width={1000} height={800}>
        {/* https://stackoverflow.com/questions/71467209/three-js-ply-loader-object-not-rendered-properly */}
            <PointCloud width={1000} height={735} plyFile={PLY_FILES[0]}/>
        </CloudCard>
        <CloudCard title={"Points of Interest"} width={400}>
            <Empty className='standard-padding' description="No points of interest available"/>
        </CloudCard>
    </div>
  )
}

Map.propTypes = {}

export default Map

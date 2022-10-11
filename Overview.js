import React from 'react'

import CloudCard from './src/components/CloudCard'
import { Empty } from 'antd'

const CATEGORIES = [
  'Location', 'Description', 'Notes and events', 'Recent alerts', 'Key personnel'
]
function Overview(props) {
  return (
    <div>
      {CATEGORIES.map((c, i) => {
        return <CloudCard height={200} width={400} key={i} title={c}>
          <br/>
          <Empty description={`No ${(c || 'data').toLowerCase()} available`}/>
        </CloudCard>
      })}
    </div>
  )
}

export default Overview

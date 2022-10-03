import React from 'react'

import CloudCard from './CloudCard'
import { Empty } from 'antd'

const CATEGORIES = [
  'Location', 'Description', 'Notes and events', 'Recent alerts', 'Key personnel'
]
function Home(props) {
  return (
    <div>
      {CATEGORIES.map((c, i) => {
        return <CloudCard height={200} title={c}>
        <br/>
        <Empty description={`No ${c} data avaiable`}/>
        </CloudCard>
      })}
    </div>
  )
}

export default Home

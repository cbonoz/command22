import { Col, Empty, Row, Table } from 'antd'
import React from 'react'
import CloudCard from './CloudCard'

export default function VideoStreams() {
  return (<div>
    <Row>
        <Col span={6}>
    <CloudCard title="Video Streams" width="100%">
        <Table
        locale={{emptyText:"No videos uploaded"}}
        />
    </CloudCard>
</Col>
<Col span={1}/>
        <Col span={16}>
    <CloudCard width="100%" title="Selected Video">
        <br/>
        <Empty description="No video selected"/>

    </CloudCard>
    </Col>
</Row>
    {/* <div className='white'>Video Streams</div> */}
</div>
  )
}

import { Col, Empty, Row, Table } from 'antd'
import React, {useState, useEffect} from 'react'
import { FileUploader } from 'react-drag-drop-files'
import ReactPlayer from 'react-player'
import { createObjectUrl } from '../util'
import CloudCard from './CloudCard'

export default function VideoStreams() {
    const [video, setVideo] = useState()

    // useEffect(() => {

    // }, [video])

    const handleChange = (f) => {
        const s = createObjectUrl(f)
        console.log('s', s)
        setVideo(s)//  || 'https://www.youtube.com/watch?v=ysz5S6PUM-U')
    }

  return (<div className='video-stream-content'>
    <Row>
        <Col span={6}>
    <CloudCard title="Video Streams" width="100%">
        <Table
        locale={{emptyText:"No videos uploaded"}}
        />
        <div className='standard-padding'>
            <FileUploader
                multiple={false}
                handleChange={handleChange}
                name="file"
                types={['mp4', 'wav']}
            />
        </div>
    </CloudCard>
</Col>
<Col span={1}/>
        <Col span={16}>
    <CloudCard height={600} width="100%" title="Selected Video">
        <div className='video-stream-content'>
        <br/>
        {!video && <Empty description="No video selected"/>}
        {/* https://github.com/CookPete/react-player */}
        {video && <ReactPlayer url={video}/>}
</div>

    </CloudCard>
    </Col>
</Row>
    {/* <div className='white'>Video Streams</div> */}
</div>
  )
}

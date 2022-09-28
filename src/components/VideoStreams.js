import { Button, Col, Empty, Input, Row, Table } from 'antd'
import React, {useState, useEffect} from 'react'
import { FileUploader } from 'react-drag-drop-files'
import ReactPlayer from 'react-player'
import { createObjectUrl } from '../util'
import CloudCard from './CloudCard'
/*
Example stream: https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8'
*/
export default function VideoStreams() {
    const [video, setVideo] = useState()
    const [text, setText] = useState()

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
    <CloudCard title="Manage Video Streams" width="100%">
        {/* <h3>Enter stream url:</h3> */}
        {/* <Table
        locale={{emptyText:"No videos uploaded"}}
        /> */}
        <div className='standard-padding'>
            {/* <FileUploader
                label="Upload a stream file"
                multiple={false}
                handleChange={handleChange}
                name="file"
                types={['mp4', 'wav', 'm3u8']}
            /> */}

            <Input.Group compact>
                <Input style={{marginBottom: '10px'}} prefix="Stream URL: " value={text} onChange={e => setText(e.target.value)} />
                <Button onClick={e => setVideo(text)} type="primary">Load stream</Button>
            </Input.Group>
        </div>
    </CloudCard>
</Col>
<Col span={1}/>
        <Col span={16}>
    <CloudCard height={600} width="100%" title="Selected Video">
        <div className='video-stream-content'>
        <br/>
        {!video && <Empty description="No video stream active"/>}
        {/* https://github.com/CookPete/react-player */}
        {video && <span className='standard-margin'>
            <ReactPlayer url={video} controls playing/>
</span>
            }
</div>

    </CloudCard>
    </Col>
</Row>
    {/* <div className='white'>Video Streams</div> */}
</div>
  )
}

import { Button, Card, Col, Empty, Input, Row, Table } from 'antd'
import React, {useState, useEffect} from 'react'
import { FileUploader } from 'react-drag-drop-files'
import ReactPlayer from 'react-player'
import { getAnalytic, getCameras, getFrame } from '../api'
import { getAnalyticEndpoint } from '../api/analytics'
import { convertToArray, createObjectUrl, getDataUrl, getReadableDateTime } from '../util'
import CloudCard from './CloudCard'
/*
Example stream: https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8'
*/

import { useInterval } from 'usehooks-ts'

export default function VideoStreams() {
    const [videos, setVideos] = useState()
    const [video, setVideo] = useState()
    const [text, setText] = useState()
    const [frame, setFrame] = useState()
    const [analytics, setAnalytics] = useState()

    async function nextFrame(cameraId) {
        try {
            const {data} = await getFrame(cameraId)
            setFrame(data)
        } catch (e) {
            console.error('error getting frame', e)
        }
    }

    useInterval(
        () => {
          // Your custom logic here
          nextFrame(video?.id)
        },
        // Delay in milliseconds or null to stop it
        (video && video.id) ? 1000 : null,
      )

    async function fetchAnalytics(analyticName) {
        const endpoint = getAnalyticEndpoint(analyticName)
        console.log('get analytic', endpoint, video.id)
        try {
            const {data} = await getAnalytic(video.id, endpoint)
            console.log('results', data)
            setAnalytics({...data, analyticName})
        } catch (e) {
            console.error('err', e)
            let msg = e.toString()
            if (msg.indexOf('503') !== 0) {
                // Server outage / issue (should retry)
                msg = 'Server temporarily unavailable. Please try again.'
            }
            alert('Error getting data: ' + msg.toString())
        }
    }

    async function cameras() {
        console.log('cameras')
        try {
            const {data} = await getCameras()
            console.log('results', data)
            setVideos(data)
        } catch (e) {
            console.error('err', e)

            let msg = e.toString()
            if (msg.indexOf('503') !== 0) {
                // Server outage / issue (should retry)
                msg = 'Server temporarily unavailable. Please try again.'
            }
            alert('Error getting video streams: ' + msg.toString())
        }
    }

    useEffect(() => {
        cameras()
    }, [])

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
            {(videos?.map((v, i) => (<div>
                <a key={i}onClick={() => setVideo(v)}>{v.name}</a>
            </div>)))}

            <hr/>

            <Input.Group compact>
                <p>Or enter custom url</p>
                <Input style={{marginBottom: '10px'}} prefix="Stream URL: " value={text} onChange={e => setText(e.target.value)} />
                <Button onClick={e => setVideo({name: text, link: text})} type="primary">Load stream</Button>
            </Input.Group>
        </div>
    </CloudCard>
</Col>
<Col span={1}/>
        <Col span={16}>
    <CloudCard minHeight={500} width="100%" title={`Selected Video${video ? `: ${video.name}` : ''}`}>
        <div className='video-stream-content'>
        {!video && <Empty description="No video stream active"/>}
        {/* https://github.com/CookPete/react-player */}
        {video && <span className='standard-margin'>
            {/* {video.link && <ReactPlayer url={video.link} controls playing/>} */}
            {video.id && frame && <div>
                <p>Time: {getReadableDateTime(parseFloat(frame.timestamp)*1000)}</p>
                <img className='analytics-image' alt="Image" src={getDataUrl(frame.image)} />
            </div>}
            {convertToArray(video.services).map((s, i) => {
                return <Button className='standard-margin' type="primary" key={i} onClick={() => fetchAnalytics(s)}>
                    {s}
                </Button>
            })}
            {analytics && <span>
                <h3>{analytics.analyticName}</h3>
                {analytics.image && <img className='analytics-image' alt="Image" src={getDataUrl(analytics.image)} />}
                {analytics.results && <p>
                    Results: {analytics.results}
                </p>}
            </span>}
</span>}
</div>

    </CloudCard>
    </Col>
</Row>
    {/* <div className='white'>Video Streams</div> */}
</div>
  )
}

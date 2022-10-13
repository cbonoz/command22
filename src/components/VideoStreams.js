import { Button, Col, Empty, Input, Row, Table } from 'antd'
import React, {useState, useEffect} from 'react'
import { FileUploader } from 'react-drag-drop-files'
import ReactPlayer from 'react-player'
import { getAnalytic, getCameras } from '../api'
import { getAnalyticEndpoint } from '../api/analytics'
import { convertToArray, createObjectUrl, getReadableDateTime } from '../util'
import CloudCard from './CloudCard'
/*
Example stream: https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8'
*/
export default function VideoStreams() {
    const [videos, setVideos] = useState()
    const [video, setVideo] = useState()
    const [text, setText] = useState()
    const [analytics, setAnalytics] = useState()


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
    <CloudCard minHeight={500} width="100%" title="Selected Video">
        <div className='video-stream-content'>
        {!video && <Empty description="No video stream active"/>}
        {/* https://github.com/CookPete/react-player */}
        {video && <span className='standard-margin'>
            <h1>{video.name}</h1>
            <ReactPlayer url={video.link} controls playing/>
            {convertToArray(video.services).map((s, i) => {
                return <Button className='standard-margin' type="primary" key={i} onClick={() => fetchAnalytics(s)}>
                    {s}
                </Button>
            })}
            {analytics && <span>
                <h3>{analytics.analyticName}</h3>
                <p>Time: {getReadableDateTime(analytics.timestamp)}</p>
                {analytics.image && <img className='analytics-image' alt="Image" src={`data:image/jpeg;base64,${analytics.image}`} />}
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

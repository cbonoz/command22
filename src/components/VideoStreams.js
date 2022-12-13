import { Button, Card, Col, Empty, Input, Modal, Row, Spin, Table } from 'antd'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import ReactPlayer from 'react-player'
import { getAnalytic, getCameras, getFrame } from '../api'
import { getAnalyticEndpoint } from '../api/analytics'
import { convertToArray, createObjectUrl, getBoundBoxes, getDataUrl, getReadableDateTime, getReadableError } from '../util'
import CloudCard from './CloudCard'
/*
Example stream: https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
*/

import { useInterval } from 'usehooks-ts'
import Boundingbox from './BoundingBox'
import { useParams } from 'react-router-dom'

export default function VideoStreams() {
    const [videos, setVideos] = useState()
    const [video, setVideo] = useState()
    const [text, setText] = useState()
    const [frame, setFrame] = useState()
    const [first, setFirst] = useState(true)
    const [selected, setSelected] = useState() // Selected object.
    const [analytics, setAnalytics] = useState()

    let { cameraId } = useParams()
    cameraId = parseInt(cameraId)

    useEffect(() => {
        // Clear.
        setAnalytics()
        setFrame()
        setFirst(true)
    }, [video])

    async function nextFrame(cameraId) {
        try {
            const { data } = await getFrame(cameraId)
            setFrame(data)
        } catch (e) {
            console.error('error getting frame', e)
        }
    }

    useEffect(() => {
        if (videos && cameraId) {
            const v = videos.find(v => v.id === cameraId)
            if (v) {
                setVideo(v)
            }
        }
    }, [videos, cameraId]);

    useInterval(
        () => {
            // Your custom logic here
            nextFrame(video?.id)
        },
        // Delay in milliseconds or null to stop it
        (video && video.id) ? 1000 : null,
    )

    async function fetchAnalytics(analyticName, firstFetch) {
        const endpoint = getAnalyticEndpoint(analyticName)
        console.log('get analytic', endpoint, video.id)
        try {
            const { data } = await getAnalytic(video.id, endpoint)
            console.log('results', data)
            if (typeof data?.results === 'string') {
                data['results'] = JSON.parse(data.results)
            }
            setAnalytics({ ...data, analyticName, endpoint })
        } catch (e) {
            console.error('err', e)
            let msg = e.toString()
            if (msg.indexOf('503') !== 0) {
                // Server outage / issue (should retry)
                msg = 'Server temporarily unavailable. Please try again.'
            }
            alert('Error getting data: ' + msg.toString())
        }

        // TODO: hack to force rerender of bounding boxes.
        if (firstFetch) {
            setFirst(false)
            fetchAnalytics(analyticName, false)
        }
    }

    const onBoxSelected = (index) => {
        const results = analytics?.results || []
        console.log('box selected', index, results[index])
        setSelected(results[index])
        // alert(results[index])
    }

    async function cameras() {
        console.log('cameras')
        try {
            const { data } = await getCameras()
            console.log('results', data)
            setVideos(data)
        } catch (e) {
            console.error('err', e)
            const msg = getReadableError(e)
            alert('Error getting video streams: ' + msg)
        }
    }

    useEffect(() => {
        cameras()
    }, [])

    const boxes = useMemo(() => {
        const canvas = document.getElementById('box-canvas');
        let height = 720
        let width = 1280
        if (canvas) {
            width = canvas.getAttribute('width')
            height = canvas.getAttribute('height')
        }
        const results = getBoundBoxes(analytics?.results || [], width, height)
        console.log('boxes', results)
        return results
    }, [analytics])

    const { image, endpoint } = analytics || {}


    const imageUrl = getDataUrl(image)
    const isDetection = endpoint === 'objectdetection' || endpoint === 'personattribute'

    const loaded = video && frame;

    return (<div className='video-stream-content'>
        <Row>
            <Col span={6}>
                <CloudCard title="Manage Video Streams" width="100%">
                    <div className='standard-padding'>
                        <h3>Select stream</h3>
                        {(videos?.map((v, i) => {
                            const selectedVideo = video?.id === v.id
                            return <div>
                                <a className={selectedVideo ? 'bold' : ''} key={i} onClick={() => setVideo(v)}>{v.name}</a>
                            </div>
                        }))}
                        <hr />

                        <Input.Group compact>
                            <p>Or enter custom url</p>
                            <Input style={{ marginBottom: '10px' }} prefix="Stream URL: " value={text} onChange={e => setText(e.target.value)} />
                            <Button onClick={e => setVideo({ name: text, link: text })} type="primary">Load stream</Button>
                        </Input.Group>
                    </div>
                </CloudCard>
            </Col>
            <Col span={1} />
            <Col span={16}>
                <CloudCard minHeight={500} width="100%" title={`Selected Video${video ? `: ${video.name}` : ''}`}>
                    <div className='video-stream-content'>
                        {!video && <Empty description="No video stream active" />}
                        {video && !frame && <Spin size="large" />}
                        {/* https://github.com/CookPete/react-player */}
                        {loaded && <span className='standard-margin'>
                            {video.link && <ReactPlayer url={video.link} controls playing />}
                            {video.id && frame && <div>
                                <p>Time: {getReadableDateTime(parseFloat(frame.timestamp) * 1000)}</p>
                                <img className='analytics-image' alt="Image" src={getDataUrl(frame.image)} />
                            </div>}
                            <br/>

                            <p>Click the buttons below to freeze frame.</p>
                            <div className='vertical-margin'>
                            {/* Service button row */}
                            {convertToArray(video.services).map((s, i) => {
                                return <span key={i}><Button type="primary" onClick={() => fetchAnalytics(s, first)}>
                                    {s}
                                </Button>&nbsp;</span>
                            })}
                            </div>

                            {analytics && <span>
                                <h3>{analytics.analyticName}</h3>
                                {/* <img className='analytics-image' alt="Image" src={getDataUrl(analytics.image)} /> */}
                                {imageUrl && <div style={{ height: 480, width: 640 }}>
                                    {analytics.results && isDetection && <p>
                                        Results: {boxes?.length}
                                    </p>}
                                    <Boundingbox onSelected={(i) => onBoxSelected(i)} canvasId={'box-canvas'} image={imageUrl} boxes={boxes} />
                                </div>}


                            </span>}
                        </span>}
                    </div>

                </CloudCard>
            </Col>
        </Row>

        <Modal
            title={"Detected attribute"}
            visible={!!selected}
            showCancel={false}
            cancelText="Close"
            okButtonProps={{
                style: {
                    display: "none",
                },
            }}
            onCancel={() => setSelected(undefined)}
        >
            {Object.keys(selected || {}).map((k, i) => {
                return <li key={i}><b>{k}:</b> {JSON.stringify(selected[k])}</li>
            })}
        </Modal>
        {/* <div className='white'>Video Streams</div> */}
    </div>
    )
}

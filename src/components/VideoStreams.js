import { Button, Col, Input, Modal, Row, } from 'antd'
import React, { useState, useEffect, } from 'react'
import CloudCard from './CloudCard'
/*
Example stream: https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8
*/

import { useParams } from 'react-router-dom'
import VideoStream from './VideoStream'
import { getCameras } from '../api'
import { getReadableError } from '../util'
import { DEFAULT_GUTTER } from '../util/constants'

export default function VideoStreams() {
    const [videos, setVideos] = useState()
    const [video, setVideo] = useState()
    const [text, setText] = useState()
    const [selected, setSelected] = useState() // Selected object.

    let { cameraId } = useParams()
    cameraId = parseInt(cameraId)

    async function cameras() {
        console.log('cameras')
        try {
            const cameras = await getCameras()
            console.log('results', cameras)
            setVideos(cameras)
        } catch (e) {
            console.error('err', e)
            const msg = getReadableError(e)
            alert('Error getting video streams: ' + msg)
        }
    }
    useEffect(() => {
        cameras()
    }, [])

    useEffect(() => {
        if (videos && cameraId) {
            const v = videos.find(v => v.id === cameraId)
            if (v) {
                setVideo(v)
            }
        }
    }, [videos, cameraId]);




    const onBoxClicked = (box) => setSelected(box)

    return (<div className='video-stream-content body-padding'>
        <Row gutter={DEFAULT_GUTTER}>
            <Col xs={24} xl={6}>
                <CloudCard title="Manage Video Streams" width="100%">
                    <div className='standard-padding'>
                        <h3>Select stream</h3>
                        {(videos?.map((v, i) => {
                            const selectedVideo = video?.id === v.id
                            return <div key={i}>
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
            <Col xs={24} xl={18}>
                <CloudCard minHeight={500} width="100%" title={`Selected Video${video ? `: ${video.name}` : ''}`}>
                    <VideoStream video={video} onBoxClicked={onBoxClicked} />
                </CloudCard>
            </Col>
        </Row>

        <Modal
            title={"Detected attribute"}
            open={!!selected}
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

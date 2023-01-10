
import { Empty, Spin, Button, Select, Row, Col } from 'antd';
import Boundingbox from './BoundingBox';
import React, { useState, useEffect, useMemo } from 'react'
import ReactPlayer from 'react-player'
import { useInterval } from 'usehooks-ts'
import { getAnalytic, getFrame } from '../api'
import { getAnalyticEndpoint } from '../api/analytics'
import { convertToArray, getBoundBoxes, getDataUrl, getReadableDateTime, getReadableError } from '../util'
import { DEFAULT_GUTTER } from '../util/constants';
import CloudCard from './CloudCard';
import RenderObject from './RenderObject';

function VideoStream({ video, onBoxClicked }) {
    const [frame, setFrame] = useState()
    const [first, setFirst] = useState(true)
    const [boxData, setBoxData] = useState()
    const [analytics, setAnalytics] = useState()
    const [filters, setFilters] = useState()
    const [filterOptions, setFilterOptions] = useState()

    const onFiltersChanged = (vals) => {
        console.log('filters', vals)
        setFilters(vals)
    }

    async function nextFrame() {
        if (!video) {
            return
        }

        try {
            const { data } = await getFrame(video.id)
            setFrame(data)
        } catch (e) {
            console.error('error getting frame', e)
        }
    }

    useInterval(nextFrame,
        // Delay in milliseconds or null to stop it
        (video && video.id) ? 1000 : null,
    )


    useEffect(() => {
        // Clear.
        setAnalytics()
        setFilters()
        setFilterOptions()
        setBoxData()
        setFrame()
        setFirst(true)
    }, [video])

    const boxes = useMemo(() => {
        const canvas = document.getElementById('box-canvas');
        let height = 720
        let width = 1280
        if (canvas) {
            width = canvas.getAttribute('width')
            height = canvas.getAttribute('height')
        }
        let results = getBoundBoxes(analytics?.results || [], width, height)
        if (filters && filters.length > 0 && results) {
            const processedFilters = filters.map(f => {
                const tokens = f.split(':')
                return {
                    key: tokens[0],
                    value: tokens[1]
                }
            })
            console.log('boxes', results)
            results = results.filter(box => processedFilters.every(f => box[f.key] === f.value))
        }
        console.log('boxes', results)
        return results
    }, [analytics, filters])

    const { image, endpoint } = analytics || {}

    const imageUrl = getDataUrl(image)
    const isDetection = endpoint === 'objectdetection' || endpoint === 'personattribute'

    const loaded = video && frame;

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
            if (endpoint === 'personattribute') {
                const myList = []
                for (let i = 0; i < data.results.length; i++) {
                    const result = data.results[i]
                    const keys = Object.keys(result)
                    for (let j = 0; j < keys.length; j++) {
                        const key = keys[j]
                        if (key === 'detection') {
                            continue
                        }
                        const val = result[key]
                        myList.push((key + ':' + val).toLowerCase())
                    }
                }

                const unique = [...new Set(myList)];
                setFilterOptions(unique.map(f => {
                    return {
                        label: f,
                        value: f
                    }
                }))
            }
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
        console.log('box selected', index, boxes[index])
        setBoxData(boxes[index])
        onBoxClicked && onBoxClicked(boxes[index])
    }

    const Title = ({ title, time }) => <span><b>{title.toUpperCase()}</b> - Time: {time}</span>

    return (
        <div className='video-stream-content'>
            <Row gutter={DEFAULT_GUTTER}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    {!video && <Empty description="No video stream active" />}
                    {video && !frame && <Spin size="large" />}
                    {loaded && <div>
                        {/* https://github.com/CookPete/react-player */}
                        {video.link && <ReactPlayer url={video.link} controls playing />}

                        <CloudCard title={<Title title="live feed" time={getReadableDateTime(parseFloat(frame.timestamp) * 1000)} />}>
                            <img className='analytics-image' alt="Image" src={getDataUrl(frame.image)} />
                        </CloudCard>

                        <CloudCard title={"ANALYZE SNAPSHOT"}>
                            <p>Select an analytics type button below to generate a snapshot with analytics.<br />Click again to update the snapshot frame.</p>
                            <div className='vertical-margin'>
                                {/* Service button row */}
                                {convertToArray(video.services).map((s, i) => {
                                    return <Button className='small-margin' size="large" type="primary" onClick={() => fetchAnalytics(s, first)}>
                                        {s}
                                    </Button>
                                })}
                            </div>
                            {analytics?.error && <p>Error: {getReadableError(analytics.error)}</p>}

                        </CloudCard>


                    </div>}
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>

                    {analytics && <span>
                        <CloudCard title={<Title title={"snapshot"} time={getReadableDateTime(parseFloat(analytics.timestamp) * 1000)} />}>
                            {/* {imageUrl && <div style={{ height: 480, width: 640 }}> */}
                            <Boundingbox onSelected={(i) => onBoxSelected(i)} canvasId={'box-canvas'} image={imageUrl} boxes={boxes} />
                            {/* </div>} */}
                        </CloudCard>
                        <CloudCard title={analytics.analyticName}>
                            {endpoint === 'personattribute' && <div>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '90%' }}
                                    placeholder="Filter for specific objects of interest"
                                    defaultValue={filters}
                                    onChange={onFiltersChanged}
                                    options={filterOptions}
                                />
                            </div>}
                            {analytics.results && <p>
                                Results: {isDetection ? boxes?.length : JSON.stringify(analytics.results)}
                            </p>}
                            {boxData && <div>
                                <RenderObject className="attribute-box" title={"selected object"} obj={boxData} />
                            </div>}
                        </CloudCard>
                        {/* <img className='analytics-image' alt="Image" src={getDataUrl(analytics.image)} /> */}



                    </span>}

                </Col>

            </Row>
        </div >
    )
}


export default VideoStream
